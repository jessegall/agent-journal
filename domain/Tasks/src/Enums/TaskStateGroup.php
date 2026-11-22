<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * The tabs the Tasks page filters by, as the design draws them: the open work (open, started or blocked) and the done
 * work (finished or cancelled).
 */
enum TaskStateGroup: string
{
    case Open = 'open';
    case Done = 'done';

    /**
     * @return list<TaskState>
     */
    public function states(): array
    {
        return match ($this) {
            self::Open => [TaskState::Open, TaskState::Started, TaskState::Blocked],
            self::Done => [TaskState::Finished, TaskState::Cancelled],
        };
    }
}
