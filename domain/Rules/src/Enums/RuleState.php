<?php

declare(strict_types=1);

namespace Domain\Rules\Enums;

/**
 * Where a rule stands: proposed, active, denied or removed. Only an active rule reaches the agents.
 */
enum RuleState: string
{
    case Proposed = 'proposed';
    case Active = 'active';
    case Denied = 'denied';
    case Removed = 'removed';

    /**
     * The state as a list and a reader show it.
     */
    public function label(): string
    {
        return match ($this) {
            self::Proposed => 'Proposed',
            self::Active => 'Active',
            self::Denied => 'Denied',
            self::Removed => 'Removed',
        };
    }

    /**
     * The tone of the state's badge: a proposal waits, an active rule holds, the rest are over.
     */
    public function tone(): string
    {
        return match ($this) {
            self::Proposed => 'busy',
            self::Active => 'good',
            self::Denied, self::Removed => 'quiet',
        };
    }
}
