<?php

declare(strict_types=1);

namespace App\Asks\Enums;

/**
 * Why an ask closed without an answer: it outlived its lifetime, its escalation came back to an actor it already
 * passed, no higher owner exists, or the root of the chain let it time out. The ask stays visible either way.
 */
enum UnansweredReason: string
{
    case TotalExpiry = 'total_expiry';
    case Cycle = 'cycle';
    case NoOwner = 'no_owner';
    case RootTimeout = 'root_timeout';
}
