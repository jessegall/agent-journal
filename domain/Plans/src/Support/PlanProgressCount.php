<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Values\PlanProgress;
use Domain\Tasks\Enums\TaskStatus;
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
    public static function afterMove(PlanProgress $progress, TaskStatus $from, TaskStatus $to): PlanProgress
    {
        return self::withChange(self::withChange($progress, $from, -1), $to, 1);
    }

    private static function withChange(PlanProgress $progress, TaskStatus $status, int $change): PlanProgress
    {
        return match ($status) {
            TaskStatus::Open => $progress,
            TaskStatus::Started => new PlanProgress(
                $progress->finished,
                $progress->cancelled,
                $progress->blocked,
                $progress->started + $change,
                $progress->total,
            ),
            TaskStatus::Blocked => new PlanProgress(
                $progress->finished,
                $progress->cancelled,
                $progress->blocked + $change,
                $progress->started,
                $progress->total,
            ),
            TaskStatus::Finished => new PlanProgress(
                $progress->finished + $change,
                $progress->cancelled,
                $progress->blocked,
                $progress->started,
                $progress->total,
            ),
            TaskStatus::Cancelled => new PlanProgress(
                $progress->finished,
                $progress->cancelled + $change,
                $progress->blocked,
                $progress->started,
                $progress->total,
            ),
        };
    }
}
