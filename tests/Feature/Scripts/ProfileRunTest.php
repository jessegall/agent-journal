<?php

declare(strict_types=1);

namespace Tests\Feature\Scripts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceReadReference;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileRevisionReference;
use App\Scripts\Commands\RecordScriptStepResult;
use App\Scripts\Enums\ProfileRunState;
use App\Scripts\Enums\StepStatus;
use App\Scripts\Exceptions\ProfileRunRefused;
use App\Scripts\Models\ProfileRun;
use App\Scripts\Support\ObjectReader;
use App\Scripts\Values\ScriptContext;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Script reads and steps go through the host once (task 961): a workspace read first waits for its host, the host's
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

        $pending = $reader->read('workspace', 'dirty', $context);

        $this->assertSame(StepStatus::Pending, $pending->unread?->status);
        $this->assertSame('read-1', $pending->unread->evidence);

        $this->answer(dirty: true);
        $this->answer(dirty: false);

        $this->assertTrue($reader->read('workspace', 'dirty', $context)->value);
        $this->assertFalse($reader->read('workspace', 'clean', $context)->value);
    }

    public function test_a_failed_read_is_a_diagnostic_and_never_false(): void
    {
        $read = $this->app->make(ObjectReader::class)->read('workspace', 'missing', $this->context());

        $this->assertSame(StepStatus::Failed, $read->unread?->status);
        $this->assertNull($read->value);
    }

    public function test_a_step_outcome_is_recorded_once_and_resumes_the_waiting_run(): void
    {
        $run = ProfileRun::forTrigger(
            ActorIdentity::of(TestStart::start('writing-helper')->agent),
            WorkReference::free('ask'),
            'journal-worker',
            1,
            str_repeat('a', 64),
            'trigger-1',
        );
        $run->suspendOn(2, 'step-1');

        $this->report($run, 'step-1', StepStatus::Completed);
        $this->report($run, 'step-1', StepStatus::Failed);

        $run->refresh();
        $this->assertSame(ProfileRunState::Running, $run->state);
        $this->assertSame([StepStatus::Completed], $run->results()->get()->map(fn ($result) => $result->status)->all());
        $this->expectException(ProfileRunRefused::class);

        $this->report($run, 'step-2', StepStatus::Completed);
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

    private function answer(bool $dirty): void
    {
        $this->asSystem(new ReportWorkspaceRead('host-1', new WorkspaceReadReference('read-1'), true, $dirty, ! $dirty, 3));
    }

    private function report(ProfileRun $run, string $step, StepStatus $status): void
    {
        $this->asSystem(new RecordScriptStepResult('host-1', $run->id, $step, $status, 'next', null));
    }
}
