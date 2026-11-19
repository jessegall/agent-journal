<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatChangeResult;
use App\Desks\Support\SeatRelease;

/**
 * Seats actors at desks. It locks the actors first and the desk after them, checks seat capacity and the expected
 * assignment, writes the seat assignment and advances the desk's seating revision, all in one transaction.
 */
interface SeatingWriter
{
    /**
     * Seats the actor in the desk's lowest free seat; an actor already seated there keeps its seat.
     */
    public function seat(string $deskId, ActorIdentity $actor): SeatChangeResult;

    public function replace(SeatChange $change): SeatChangeResult;

    public function release(SeatRelease $release): void;
}
