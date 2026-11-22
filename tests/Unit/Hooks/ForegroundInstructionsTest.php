<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;
use Domain\Plans\Support\States\WorkingOnPlanState;
use Domain\Plans\Values\PlanProgress;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use PHPUnit\Framework\TestCase;

/**
 * A task or plan frame names its work record and answers its own instruction, read fresh each time it is asked.
 */
final class ForegroundInstructionsTest extends TestCase
{
    public function test_a_task_frame_names_its_task_and_run(): void
    {
        $state = new WorkingOnTaskState(new TaskWork(12, 3, TaskState::Started));

        $this->assertSame(Task::LINK_TYPE, $state->workRecordType()->get());
        $this->assertStringContainsString('12', $state->instruction()->get());
        $this->assertStringContainsString('3', $state->instruction()->get());
    }

    public function test_a_plan_frame_reads_its_progress_each_time_it_is_asked(): void
    {
        $progress = new PlanProgress(finished: 2, cancelled: 0, blocked: 0, started: 1, total: 4);
        $state = new WorkingOnPlanState(new PlanWork('plan-7', 7, PlanState::Started), function () use (&$progress) {
            return $progress;
        });

        $first = $state->instruction()->get();
        $progress = new PlanProgress(finished: 3, cancelled: 0, blocked: 0, started: 1, total: 4);

        $this->assertSame(Plan::LINK_TYPE, $state->workRecordType()->get());
        $this->assertNotSame($first, $state->instruction()->get());
    }
}
