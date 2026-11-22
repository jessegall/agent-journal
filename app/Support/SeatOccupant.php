<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ActorType;

/**
 * The actor a seat assignment seats. Seating only ever gives a seat to an actor, so the holder names one.
 */
final readonly class SeatOccupant
{
    public static function of(Assignment $seat): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($seat->holder()->type), $seat->holder()->id);
    }
}
