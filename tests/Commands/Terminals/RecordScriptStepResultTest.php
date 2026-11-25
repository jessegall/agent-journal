<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\StopPreparationStatus;
use App\Enums\Profiles\ProfileRunStatus;
use App\Enums\Terminals\StepStatus;
use App\Exceptions\ProfileRunRefused;
use App\Models\Agents\PendingAgentMessage;
use App\Models\Profiles\ProfileRun;
use App\Models\Projects\WorkspaceRead;
use App\Support\ActorReference;
use App\Support\ProfileProposal;
use App\Values\AgentText;
use App\Values\CommitObservation;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;
use App\Values\WorkReference;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A step's outcome is recorded once and resumes the run that waits on it.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and records host answers.')]
#[TestsCommand(RecordScriptStepResultCommand::class)]
final class RecordScriptStepResultTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'active_accounts',
        'account_notices',
        'accounts',
        'session_processes',
        'agent_runtimes',
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

    private ActorReference $writer;

    private int $stops = 0;

    private const string FAILED_TESTS = '2 tests failed.';

    public function test_a_step_outcome_is_recorded_once_and_resumes_the_waiting_run(): void
    {
        $run = ProfileRun::create(
            ActorReference::of($this->journal->signedStart('Test agent', 'writing-helper')->agent),
            WorkReference::free('ask'),
            'journal-worker',
            1,
            str_repeat('a', 64),
            'trigger-1',
        );
        $run->suspendOn(2, 'step-1');

        $this->notify($run, 'step-1', StepStatus::Completed);
        $this->notify($run, 'step-1', StepStatus::Failed);

        $run->refresh();
        $this->assertSame(ProfileRunStatus::Running, $run->status);
        $this->assertSame([StepStatus::Completed], $run->results()->get()->map(fn ($result) => $result->status)->all());
        $this->expectException(ProfileRunRefused::class);

        $this->notify($run, 'step-2', StepStatus::Completed);
    }

    public function test_a_dirty_writer_runs_the_tests_before_the_guidance_reaches_it(): void
    {
        $this->activateScriptedWriter();
        $this->writer = ActorReference::of(TestStart::start('writing-helper')->agent);

        $outcome = $this->stopDirty(StepStatus::Completed, 'passed', 'All tests passed.');

        $this->assertSame(StopPreparationStatus::ReturnToActor, $outcome->state);
        $this->assertEquals(
            AgentText::of('core.stop.script_returned', ['evidence' => self::GUIDANCE]),
            $outcome->message,
        );
        $this->assertGreaterThan(0, PendingAgentMessage::countFor($this->writer));
    }

    public function test_failed_tests_send_their_diagnostics_back_without_holding_the_work(): void
    {
        $this->activateScriptedWriter();
        $this->writer = ActorReference::of(TestStart::start('writing-helper')->agent);

        $outcome = $this->stopDirty(StepStatus::Failed, 'failure', self::FAILED_TESTS);

        $this->assertSame(StopPreparationStatus::ReturnToActor, $outcome->state);
        $this->assertEquals(
            AgentText::of('core.stop.script_returned', ['evidence' => self::FAILED_TESTS]),
            $outcome->message,
        );
    }

    public function test_three_returns_on_an_unchanged_workspace_hold_the_work_and_tell_the_owner_once(): void
    {
        $this->activateScriptedWriter();
        $this->writer = ActorReference::of(TestStart::start('writing-helper')->agent);

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
        $this->activateScriptedWriter();
        $this->writer = ActorReference::of(TestStart::start('writing-helper')->agent);

        $this->assertSame(StopPreparationStatus::Preparing, $this->stopAgain()->state);
        $this->answerReads(isDirty: false);
        $this->assertSame(StopPreparationStatus::Preparing, $this->stopAgain()->state);
        $this->answerReads(isDirty: false);

        $this->assertSame(StopPreparationStatus::FinalChecks, $this->stopAgain()->state);
    }

    private function notify(ProfileRun $run, string $step, StepStatus $status): void
    {
        $this->journal->asSystem(new RecordScriptStepResultCommand('host-1', $run->id, $step, $status, 'next', null));
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
            $this->journal->asSystem(
                new NotifyWorkspaceReadCommand(
                    'host-1',
                    $read->reference,
                    true,
                    $isDirty,
                    ! $isDirty,
                    7,
                    CommitObservation::notRecorded(),
                ),
            );
        }
    }

    private function activateScriptedWriter(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
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
        $this->journal->asSystem(
            new RecordScriptStepResultCommand('host-1', $run->id, $step, $tests, $port, $evidence),
        );

        return $this->stopAgain();
    }
}
