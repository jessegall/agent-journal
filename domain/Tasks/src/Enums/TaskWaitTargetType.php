<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * What the other end of a wait is to its reader: a task they may read, a task that is gone, or a task they may not see.
 */
enum TaskWaitTargetType: string
{
    case Task = 'task';
    case Removed = 'removed';
    case Hidden = 'hidden';
}
