<?php

declare(strict_types=1);

namespace App\Asks\Enums;

enum AskRouteStatus: string
{
    case Assigned = 'assigned';
    case PendingProfile = 'pending_profile';
    case NoOwner = 'no_owner';
    case Unavailable = 'unavailable';
}
