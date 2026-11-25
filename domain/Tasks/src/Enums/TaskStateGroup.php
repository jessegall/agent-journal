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
     * @return list<TaskStatus>
     */
    public function states(): array
    {
        return match ($this) {
            self::Open => [
                TaskStatus::Open,
                TaskStatus::Started,
                TaskStatus::Blocked,
            ],
            self::Done => [
                TaskStatus::Finished,
                TaskStatus::Cancelled,
            ],
        };
    }
}
