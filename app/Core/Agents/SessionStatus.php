<?php

declare(strict_types=1);

namespace App\Core\Agents;

enum SessionStatus: string
{
    case Active = 'active';
    case SuspectedLost = 'suspected_lost';
    case Lost = 'lost';
    case Ended = 'ended';

    /**
     * Whether the session may still act: active, or only suspected lost.
     */
    public function isRunning(): bool
    {
        return match ($this) {
            self::Active, self::SuspectedLost => true,
            self::Lost, self::Ended => false,
        };
    }
}
