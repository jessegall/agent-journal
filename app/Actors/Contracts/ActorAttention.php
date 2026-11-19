<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Actors\Support\AttentionOutcome;

/**
 * Asks an actor to look, inside the caller's transaction: its current runtime is woken, if it runs in one. Nothing is
 * read or claimed for it.
 */
interface ActorAttention
{
    public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome;
}
