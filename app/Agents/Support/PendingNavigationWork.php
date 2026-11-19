<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\MainDesk;
use App\Agents\Contracts\PendingWorkSource;

/**
 * Counts the open navigation requests waiting for an actor: those the main desk holds, for the actor seated there.
 */
final readonly class PendingNavigationWork implements PendingWorkSource
{
    public function __construct(private MainDesk $mainDesk) {}

    public function pendingCount(ActorIdentity $actor): int
    {
        return $this->mainDesk->openRequestsFor($actor);
    }
}
