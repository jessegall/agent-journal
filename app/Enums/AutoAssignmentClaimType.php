<?php

declare(strict_types=1);

namespace App\Enums;

enum AutoAssignmentClaimType: string
{
    case Assigned = 'assigned';
    case Unchanged = 'unchanged';
    case Full = 'full';
    case NoCandidate = 'no_candidate';
    case Unavailable = 'unavailable';
    case Off = 'off';
}
