<?php

declare(strict_types=1);

namespace Tests\Feature\Scripts;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Scripts\ScriptChecks;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\StopPreparationStatus;
use App\Enums\Terminals\StepStatus;
use App\Models\Agents\PendingAgentMessage;
use App\Models\Profiles\ProfileRun;
use App\Models\Projects\WorkspaceRead;
use App\Support\ActorIdentity;
use App\Support\ProfileProposal;
use App\Values\AgentText;
use App\Values\CommitObservation;
use App\Values\CompiledScript;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptCheck;
use App\Values\ScriptSource;
use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;
use App\Values\WorkReference;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A profile's STOP script prepares the stop before its final checks: a dirty writer's stop runs the tests
 * before it yields, failed tests send their diagnostics back, three returns on an unchanged workspace hold the work
 * with one notice to the owner, a changed definition holds before any instruction, and a clean one goes straight to
 * the final checks.
 */
#[TimeLimit(seconds: 8, reason: 'It activates a scripted profile and walks several stops through the host.')]
final class StopPreparationTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use StartsAgentRequests;

    private const string FAILED_TESTS = '2 tests failed.';

    private const array TABLES = [
        'active_accounts', 'account_notices', 'accounts', 'session_processes', 'agent_runtimes',
        'profile_step_results',
        'profile_runs',
        'workspace_reads',
        'pending_agent_messages',
        'profile_draft_revisions',
        'profile_drafts',
        'profile_revisions',
        'profiles',
        'driver_requests',
        'agent_sessions',
        'agents',
        'session_tokens',
        'command_receipts',
    ];

    private const string GUIDANCE = 'Commit your work once the tests pass.';

    private ActorIdentity $writer;

    private int $stops = 0;

    protected function setUp(): void
    {
        parent::setUp();
        $this->activateScriptedWriter();
        $this->writer = ActorIdentity::of(TestStart::start('writing-helper')->agent);
    }

    public function test_a_dirty_writer_runs_the_tests_before_the_guidance_reaches_it(): void
    {
        $outcome = $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');

        $this->assertSame(StopPreparationStatus::ReturnToActor, $outcome->state);
        $this->assertEquals(AgentText::of('core.stop.script_returned', ['evidence' => self::GUIDANCE]), $outcome->message);
        $this->assertGreaterThan(0, PendingAgentMessage::countFor($this->writer));
    }

    public function test_failed_tests_send_their_diagnostics_back_without_holding_the_work(): void
    {
        $outcome = $this->stopDirty(StepStatus::Failed, 'failure', self::FAILED_TESTS);

        $this->assertSame(StopPreparationStatus::ReturnToActor, $outcome->state);
        $this->assertEquals(AgentText::of('core.stop.script_returned', ['evidence' => self::FAILED_TESTS]), $outcome->message);
    }

    public function test_three_returns_on_an_unchanged_workspace_hold_the_work_and_tell_the_owner_once(): void
    {
        $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $held = $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $this->stopAgain();
        $this->answerReads(isDirty: true);
        $stillHeld = $this->stopAgain();

        $this->assertSame([StopPreparationStatus::Held, true], [$held->state, $held->tellsOwner]);
        $reason = TestText::words(AgentText::of('core.stop.unchanged_returns', ['evidence' => self::GUIDANCE]));
        $this->assertSame(AgentText::of('core.stop.script_held', ['reason' => $reason])->key, $held->message->key);
        $this->assertStringContainsString($reason, TestText::words($held->message));
        $this->assertSame([StopPreparationStatus::Held, false], [$stillHeld->state, $stillHeld->tellsOwner]);
    }

    public function test_a_clean_workspace_goes_straight_to_the_final_checks(): void
    {
        $this->assertSame(StopPreparationStatus::Preparing, $this->stopAgain()->state);
        $this->answerReads(isDirty: false);
        $this->assertSame(StopPreparationStatus::Preparing, $this->stopAgain()->state);
        $this->answerReads(isDirty: false);

        $this->assertSame(StopPreparationStatus::FinalChecks, $this->stopAgain()->state);
    }

    public function test_a_changed_definition_holds_before_any_instruction_with_one_owner_notice(): void
    {
        $this->app->instance(ScriptChecks::class, new class implements ScriptChecks
        {
            public function check(ScriptSource $source): ScriptCheck
            {
                return new ScriptCheck([], [], new CompiledScript('', [], [], 'changed'), $source->hash(), 'catalogue');
            }
        });

        $held = $this->stopAgain();
        $stillHeld = $this->stopAgain();

        $this->assertSame([StopPreparationStatus::Held, true], [$held->state, $held->tellsOwner]);
        $reason = TestText::words(AgentText::of('core.stop.definitions_changed'));
        $this->assertSame(TestText::words(AgentText::of('core.stop.script_held', ['reason' => $reason])), TestText::words($held->message));
        $this->assertFalse($stillHeld->tellsOwner);
        $this->assertSame(0, WorkspaceRead::query()->count());
    }

    /**
     * Walks one stop of a dirty writer through the host: the entry read, the IF read, then the tests.
     */
    private function stopDirty(StepStatus $tests, string $port, string $evidence): StopPreparation
    {
        $this->stopAgain();
        $this->answerReads(isDirty: true);
        $this->stopAgain();
        $this->answerReads(isDirty: true);
        $this->stopAgain();
        $run = ProfileRun::query()->acrossActors()->orderByDesc('sequence')->firstOrFail();
        $step = (string) $run->awaited_step;
        $this->asSystem(new RecordScriptStepResultCommand('host-1', $run->id, $step, $tests, $port, $evidence));

        return $this->stopAgain();
    }

    private function stopAgain(): StopPreparation
    {
        $snapshot = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('scripted-writer'));
        $this->stops++;

        return $this->app->make(StopPreparer::class)->prepare(new StopPreparationRequest(
            $this->writer,
            WorkReference::free('ask'),
            'scripted-writer',
            $snapshot->revision,
            $snapshot->start->access,
            "stop-{$this->stops}",
        ));
    }

    private function answerReads(bool $isDirty): void
    {
        foreach (WorkspaceRead::query()->whereNull('sampled_at')->limit(10)->get() as $read) {
            $this->asSystem(new NotifyWorkspaceReadCommand('host-1', $read->reference, true, $isDirty, ! $isDirty, 7, CommitObservation::notRecorded()));
        }
    }

    private function activateScriptedWriter(): void
    {
        $this->startTestUserRequest(1);
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('scripted-writer');
        $source = ScriptSource::fromDefinitions(<<<'SCRIPT'
ON STOP
IF workspace.dirty
  RUN tests
  YIELD "Commit your work once the tests pass."
END
END
SCRIPT, ['tests' => [
            'executable' => '/usr/local/bin/composer',
            'arguments' => ['test:affected'],
            'directory' => 'workspace',
            'effects' => ['read', 'test'],
            'timeout_seconds' => 600,
        ]]);
        $commands->run(new SaveProfileDraftCommand($profile, 0, $source));
        $proposal = ProfileProposal::fromConfiguration(['profiles' => [
            $profile->key => ['base' => 'writing-helper', 'tier' => 2],
        ]]);
        $commands->run(new ActivateProfilesCommand($proposal, DraftExpectations::fromOptions([$profile->key.'=1'])));
    }
}
