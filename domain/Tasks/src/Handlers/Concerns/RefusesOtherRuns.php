<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers\Concerns;

use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Models\Task;

/**
 * Refuses work on a task under a run number that is not its current run.
 */
trait RefusesOtherRuns
{
    /**
     * @throws TaskRunNotYours
     */
    private function assertCurrentTaskRun(Task $task, int $number): void
    {
        if (! $task->isCurrentRun($number)) {
            throw TaskRunNotYours::forRun($task->number, $number);
        }
    }
}
