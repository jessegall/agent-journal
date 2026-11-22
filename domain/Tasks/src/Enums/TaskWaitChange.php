<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * What happened to a wait between two tasks: it was added, removed, or waived with a reason.
 */
enum TaskWaitChange: string
{
    case Added = 'added';
    case Removed = 'removed';
    case Waived = 'waived';
}
