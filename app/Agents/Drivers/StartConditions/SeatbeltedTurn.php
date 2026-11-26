<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Contracts\CommandLines\Condition;
use App\Values\DriverStart;

/**
 * A turn on an account that runs under its session's Seatbelt profile.
 *
 * @implements Condition<DriverStart>
 */
final readonly class SeatbeltedTurn implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->isTurn() && $start->account?->isSeatbelted() === true;
    }
}
