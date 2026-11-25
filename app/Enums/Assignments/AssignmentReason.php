<?php

declare(strict_types=1);

namespace App\Enums\Assignments;

/**
 * Why assignments changed, as the one committed fact of a command says.
 */
enum AssignmentReason: string
{
    case Assigned = 'assigned';
    case Reassigned = 'reassigned';
    case Unassigned = 'unassigned';
    case Retired = 'retired';
}
