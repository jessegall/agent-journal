<?php

declare(strict_types=1);

namespace App\Domain\Rules;

/**
 * Where a rule stands: proposed, active, denied or removed. Only an active rule reaches the agents.
 */
enum RuleState: string
{
    case Proposed = 'proposed';
    case Active = 'active';
    case Denied = 'denied';
    case Removed = 'removed';
}
