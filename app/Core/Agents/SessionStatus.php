<?php

declare(strict_types=1);

namespace App\Core\Agents;

enum SessionStatus: string
{
    case Active = 'active';
    case PossiblyLost = 'suspected_lost';
    case Lost = 'lost';
    case Ended = 'ended';

    /**
     * Whether the session may still act: active, or only possibly lost.
     */
    public function isRunning(): bool
    {
        return match ($this) {
            self::Active, self::PossiblyLost => true,
            self::Lost, self::Ended => false,
        };
    }
}
