<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Desks\Support\AdmittedRelease;
use App\Desks\Support\AdmittedSeat;
use App\Desks\Support\AdmittedSeatChange;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatRelease;

/**
 * The checks a seat change passes before anything is written: the involved actors' locks in order, then the desk's
 * lock, then a free seat, the expected assignment, and one forwarding seat per actor.
 */
interface SeatAdmission
{
    public function seat(string $deskId, ActorIdentity $actor): AdmittedSeat;

    public function replace(SeatChange $change): AdmittedSeatChange;

    public function release(SeatRelease $release): AdmittedRelease;
}
