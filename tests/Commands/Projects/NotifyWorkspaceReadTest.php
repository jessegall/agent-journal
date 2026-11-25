<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Enums\Terminals\StepStatus;
use App\Models\Profiles\ProfileRun;
use App\Support\ActorReference;
use App\Support\ObjectReader;
use App\Values\CommitObservation;
use App\Values\ProfileKey;
use App\Values\ProfileRevisionReference;
use App\Values\ScriptContext;
use App\Values\WorkReference;
use App\Values\WorkspaceReadReference;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Script reads and steps go through the host once: a workspace read first waits for its host, the host's
 * one answer is what every read of that reference gives, a failed read is a diagnostic and never false, and a step
 * outcome is recorded once on the run that waits on it and resumes it.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and records host answers.')]
#[TestsCommand(NotifyWorkspaceReadCommand::class)]
final class NotifyWorkspaceReadTest extends TestCase
{
    use RefreshHookDatabase;

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

    private function context(): ScriptContext
    {
        $start = $this->journal->signedStart('Test agent', 'writing-helper');

        return new ScriptContext(
            ActorReference::of($start->agent),
            WorkReference::free('ask'),
            new ProfileRevisionReference(ProfileKey::from('journal-worker'), 1),
            'trigger-1',
            new WorkspaceReadReference('read-1'),
        );
    }

    private function answer(bool $isDirty): void
    {
        $this->journal->asSystem(
            new NotifyWorkspaceReadCommand(
                'host-1',
                new WorkspaceReadReference('read-1'),
                true,
                $isDirty,
                ! $isDirty,
                3,
                CommitObservation::notRecorded(),
            ),
        );
    }

    private function notify(ProfileRun $run, string $step, StepStatus $status): void
    {
        $this->journal->asSystem(new RecordScriptStepResultCommand('host-1', $run->id, $step, $status, 'next', null));
    }
}
