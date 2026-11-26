<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\AttentionOrigin;
use App\Actors\AttentionOutcome;
use App\Support\ActorReference;

/**
 * Asks an actor to look, inside the caller's transaction: its current runtime is woken, if it runs in one. Nothing is
 * read or claimed for it.
 */
interface ActorAttention
{
    /**
     * Asks the actor to look at something from the origin: wakes a stopped agent or tells a user, and says what came of
     * it.
     */
    public function request(ActorReference $actor, AttentionOrigin $origin): AttentionOutcome;
}
