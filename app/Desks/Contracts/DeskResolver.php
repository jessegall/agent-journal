<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Actors\Contracts\Actor;
use App\Desks\Exceptions\DeskUnavailable;
use App\Desks\Support\OccupiedSeat;

/**
 * Reads desks: one desk by its id, and the seats an actor occupies with each seat's desk and exact assignment.
 */
interface DeskResolver
{
    /**
     * @throws DeskUnavailable
     */
    public function resolve(string $deskId): Desk;

    /**
     * At most a hundred seats, in desk order.
     *
     * @return list<OccupiedSeat>
     */
    public function seatsOf(Actor $actor): array;
}
