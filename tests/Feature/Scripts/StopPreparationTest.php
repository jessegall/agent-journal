<?php

declare(strict_types=1);

namespace Tests\Feature\Scripts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Values\WorkReference;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Contracts\StopPreparer;
use App\Hooks\Enums\StopPreparationState;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Values\StopPreparation;
use App\Hooks\Values\StopPreparationRequest;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\SaveProfileDraft;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;
use App\Scripts\Commands\RecordScriptStepResult;
use App\Scripts\Contracts\ScriptChecks;
use App\Scripts\Enums\StepStatus;
use App\Scripts\Models\ProfileRun;
use App\Scripts\Support\ScriptStopPreparation;
use App\Scripts\Values\ScriptCheck;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A profile's STOP script prepares the stop before its final checks (task 962): a dirty writer's stop runs the tests
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

    private const array TABLES = [
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
        'start_tokens',
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

        $this->assertSame(StopPreparationState::ReturnToActor, $outcome->state);
        $this->assertSame(self::GUIDANCE, $outcome->message);
        $this->assertGreaterThan(0, PendingAgentMessage::countFor($this->writer));
    }

    public function test_failed_tests_send_their_diagnostics_back_without_holding_the_work(): void
    {
        $outcome = $this->stopDirty(StepStatus::Failed, 'failure', '2 tests failed.');

        $this->assertSame(StopPreparationState::ReturnToActor, $outcome->state);
        $this->assertSame('2 tests failed.', $outcome->message);
    }

    public function test_three_returns_on_an_unchanged_workspace_hold_the_work_and_tell_the_owner_once(): void
    {
        $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $held = $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');
        $this->stopAgain();
        $this->answerReads(dirty: true);
        $stillHeld = $this->stopAgain();

        $this->assertSame([StopPreparationState::Held, true], [$held->state, $held->tellsOwner]);
        $this->assertStringStartsWith(ScriptStopPreparation::RETURNS_HELD, $held->message);
        $this->assertSame([StopPreparationState::Held, false], [$stillHeld->state, $stillHeld->tellsOwner]);
    }

    public function test_a_clean_workspace_goes_straight_to_the_final_checks(): void
    {
        $this->assertSame(StopPreparationState::Preparing, $this->stopAgain()->state);
        $this->answerReads(dirty: false);
        $this->assertSame(StopPreparationState::Preparing, $this->stopAgain()->state);
        $this->answerReads(dirty: false);

        $this->assertSame(StopPreparationState::FinalChecks, $this->stopAgain()->state);
    }

    public function test_a_changed_definition_holds_before_any_instruction_with_one_owner_notice(): void
    {
        $this->app->instance(ScriptChecks::class, new class implements ScriptChecks
        {
            public function check(ScriptSource $source): ScriptCheck
            {
                return new ScriptCheck([], [], new CompiledScript([], 'changed'), $source->hash(), 'catalogue');
            }
        });

        $held = $this->stopAgain();
        $stillHeld = $this->stopAgain();

        $this->assertSame([StopPreparationState::Held, true], [$held->state, $held->tellsOwner]);
        $this->assertSame(ScriptStopPreparation::DEFINITIONS_CHANGED, $held->message);
        $this->assertFalse($stillHeld->tellsOwner);
        $this->assertSame(0, WorkspaceRead::query()->count());
    }

    /**
     * Walks one stop of a dirty writer through the host: the entry read, the IF read, then the tests.
     */
    private function stopDirty(StepStatus $tests, string $port, string $evidence): StopPreparation
    {
        $this->stopAgain();
        $this->answerReads(dirty: true);
        $this->stopAgain();
        $this->answerReads(dirty: true);
        $this->stopAgain();
        $run = ProfileRun::query()->acrossActors()->orderByDesc('sequence')->firstOrFail();
        $step = (string) $run->awaited_step;
        $this->asSystem(new RecordScriptStepResult('host-1', $run->id, $step, $tests, $port, $evidence));

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

    private function answerReads(bool $dirty): void
    {
        foreach (WorkspaceRead::query()->whereNull('sampled_at')->readLimit(10)->get() as $read) {
            $this->asSystem(new ReportWorkspaceRead('host-1', $read->reference(), true, $dirty, ! $dirty, 7));
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
            'effects' => ['read:workspace', 'test:workspace'],
            'timeout_seconds' => 600,
        ]]);
        $commands->run(new SaveProfileDraft($profile, 0, $source));
        $proposal = ProfileProposal::fromConfiguration(['profiles' => [
            $profile->key => ['base' => 'writing-helper', 'model' => 'sonnet'],
        ]]);
        $commands->run(new ActivateProfiles($proposal, DraftExpectations::fromOptions([$profile->key.'=1'])));
    }
}
