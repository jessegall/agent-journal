<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\RecordScriptStepResult\RecordScriptStepResultCommand;
use App\Enums\Profiles\ProfileRunStatus;
use App\Enums\Terminals\StepStatus;
use App\Exceptions\ProfileRunRefused;
use App\Models\Profiles\ProfileRun;
use App\Support\ActorIdentity;
use App\Values\WorkReference;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A step's outcome is recorded once and resumes the run that waits on it.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and records host answers.')]
final class RecordScriptStepResultTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

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
        $this->assertSame(ProfileRunStatus::Running, $run->status);
        $this->assertSame([StepStatus::Completed], $run->results()->get()->map(fn ($result) => $result->status)->all());
        $this->expectException(ProfileRunRefused::class);

        $this->notify($run, 'step-2', StepStatus::Completed);
    }

    private function notify(ProfileRun $run, string $step, StepStatus $status): void
    {
        $this->asSystem(new RecordScriptStepResultCommand('host-1', $run->id, $step, $status, 'next', null));
    }
}
