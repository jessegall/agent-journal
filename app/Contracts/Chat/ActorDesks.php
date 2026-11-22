<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Support\ActorIdentity;
use App\Support\SeatChangeResult;

/**
 * Gives an actor its own desk: a personal desk with one seat, the actor seated there and preferring it, written in
 * the caller's transaction so a failure undoes the actor's admission with it.
 */
interface ActorDesks
{
    public function provision(ActorIdentity $actor, string $label): SeatChangeResult;
}
