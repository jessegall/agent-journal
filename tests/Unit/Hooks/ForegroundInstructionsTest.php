<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Commands\RefreshPlanInstruction;
use App\Hooks\Contracts\InstructsForeground;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\States\WorkingOnPlanState;
use Domain\Plans\Support\PlanWork;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use PHPUnit\Framework\TestCase;

final class ForegroundInstructionsTest extends TestCase
{
    public function test_a_task_frame_names_its_task_and_run(): void
    {
        $state = new WorkingOnTaskState(new TaskWork(12, 3, TaskState::Started));

        $this->assertInstanceOf(InstructsForeground::class, $state);
        $this->assertSame(['tasks.task', 'Work on task 12, run 3.'], [$state->instructionType(), $state->instructionText()]);
    }

    public function test_a_plan_frame_names_its_plan_and_the_counts_it_was_read_with(): void
    {
        $progress = new PlanProgress(done: 2, started: 1, blocked: 0, total: 4);
        $state = new WorkingOnPlanState(new PlanWork('plan-7', 7, PlanState::Started), fn () => $progress);

        $this->assertSame(
            ['plans.plan', 'Continue plan 7. 2 of 4 tasks are finished.'],
            [$state->instructionType(), $state->instructionText()],
        );
    }

    public function test_a_plan_frame_refreshes_only_for_its_own_plan(): void
    {
        $state = new WorkingOnPlanState(new PlanWork('plan-7', 7, PlanState::Started), PlanProgress::none(...));

        $own = $state->onPlanProgressChanged(new PlanProgressChanged('plan-7'));
        $other = $state->onPlanProgressChanged(new PlanProgressChanged('plan-8'));

        $this->assertEquals([new RefreshPlanInstruction('plan-7')], $own->all());
        $this->assertSame([], $other->all());
    }
}
