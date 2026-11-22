<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\MainDesk;
use App\Contracts\Work\PendingWorkSource;

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
