<?php

declare(strict_types=1);

namespace Tests\Feature\Scripts;

use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Enums\Profiles\ProfileRunState;
use App\Enums\Terminals\StepStatus;
use App\Exceptions\ProfileRunRefused;
use App\Models\Profiles\ProfileRun;
use App\Support\ActorIdentity;
use App\Support\ObjectReader;
use App\Values\CommitObservation;
use App\Values\ProfileKey;
use App\Values\ProfileRevisionReference;
use App\Values\ScriptContext;
use App\Values\WorkReference;
use App\Values\WorkspaceReadReference;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Script reads and steps go through the host once: a workspace read first waits for its host, the host's
 * one answer is what every read of that reference gives, a failed read is a diagnostic and never false, and a step
 * outcome is recorded once on the run that waits on it and resumes it.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and records host answers.')]
final class ProfileRunTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    public function test_a_workspace_read_waits_for_its_host_and_then_gives_its_one_answer(): void
    {
        $context = $this->context();
        $reader = $this->app->make(ObjectReader::class);

        $pending = $reader->member('workspace', 'dirty', $context);

        $this->assertSame(StepStatus::Pending, $pending->unread?->status);
        $this->assertSame('read-1', $pending->unread->evidence);

        $this->answer(isDirty: true);
        $this->answer(isDirty: false);

        $this->assertTrue($reader->member('workspace', 'dirty', $context)->value);
        $this->assertFalse($reader->member('workspace', 'clean', $context)->value);
    }

    public function test_a_failed_read_is_a_diagnostic_and_never_false(): void
    {
        $read = $this->app->make(ObjectReader::class)->read('workspace', 'missing', $this->context());

        $this->assertSame(StepStatus::Failed, $read->unread?->status);
        $this->assertNull($read->value);
    }

    public function test_a_step_outcome_is_recorded_once_and_resumes_the_waiting_run(): void
    {
        $run = ProfileRun::create(
            ActorIdentity::of(TestStart::start('writing-helper')->agent),
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
        $this->assertSame(ProfileRunState::Running, $run->state);
        $this->assertSame([StepStatus::Completed], $run->results()->get()->map(fn ($result) => $result->status)->all());
        $this->expectException(ProfileRunRefused::class);

        $this->notify($run, 'step-2', StepStatus::Completed);
    }

    private function context(): ScriptContext
    {
        $start = TestStart::start('writing-helper');

        return new ScriptContext(
            ActorIdentity::of($start->agent),
            WorkReference::free('ask'),
            new ProfileRevisionReference(ProfileKey::from('journal-worker'), 1),
            'trigger-1',
            new WorkspaceReadReference('read-1'),
        );
    }

    private function answer(bool $isDirty): void
    {
        $this->asSystem(new NotifyWorkspaceReadCommand('host-1', new WorkspaceReadReference('read-1'), true, $isDirty, ! $isDirty, 3, CommitObservation::notRecorded()));
    }

    private function notify(ProfileRun $run, string $step, StepStatus $status): void
    {
        $this->asSystem(new RecordScriptStepResultCommand('host-1', $run->id, $step, $status, 'next', null));
    }
}
