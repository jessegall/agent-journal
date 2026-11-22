<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Values\PlanProgress;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Values\TaskProgress;

/**
 * Turns what Tasks counts and how its tasks move into Plans' own progress, inside Plans, so the progress Plans
 * publishes names no type of Tasks.
 */
final class PlanProgressCount
{
    /**
     * The progress Tasks counted for a set of tasks, such as the tasks just placed in a phase.
     */
    public static function of(TaskProgress $progress): PlanProgress
    {
        return new PlanProgress(
            $progress->done,
            $progress->cancelled,
            $progress->blocked,
            $progress->started,
            $progress->total,
        );
    }

    /**
     * The same tasks after one of them moved from one state to another.
     */
    public static function afterMove(PlanProgress $progress, TaskState $from, TaskState $to): PlanProgress
    {
        return self::withChange(self::withChange($progress, $from, -1), $to, 1);
    }

    private static function withChange(PlanProgress $progress, TaskState $state, int $change): PlanProgress
    {
        return match ($state) {
            TaskState::Open => $progress,
            TaskState::Started => new PlanProgress(
                $progress->finished,
                $progress->cancelled,
                $progress->blocked,
                $progress->started + $change,
                $progress->total,
            ),
            TaskState::Blocked => new PlanProgress(
                $progress->finished,
                $progress->cancelled,
                $progress->blocked + $change,
                $progress->started,
                $progress->total,
            ),
            TaskState::Finished => new PlanProgress(
                $progress->finished + $change,
                $progress->cancelled,
                $progress->blocked,
                $progress->started,
                $progress->total,
            ),
            TaskState::Cancelled => new PlanProgress(
                $progress->finished,
                $progress->cancelled + $change,
                $progress->blocked,
                $progress->started,
                $progress->total,
            ),
        };
    }
}
