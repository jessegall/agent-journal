<?php

declare(strict_types=1);

namespace App\Enums\Terminals;

/**
 * Where a browser writer's grant stands: the take waits for the host, the host issued it, it is being released,
 * it was released, the journal retired it after access ended, or the host refused the take.
 */
enum TerminalGrantState: string
{
    case Taking = 'taking';
    case Granted = 'granted';
    case Releasing = 'releasing';
    case Released = 'released';
    case Retired = 'retired';
    case Refused = 'refused';

    /**
     * The states in which the grant holds, or is about to hold, the runtime's input.
     *
     * @return list<self>
     */
    public static function holding(): array
    {
        return [
            self::Taking,
            self::Granted,
        ];
    }

    public function isHolding(): bool
    {
        return in_array($this, self::holding(), true);
    }
}
