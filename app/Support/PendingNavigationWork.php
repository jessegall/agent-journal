<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\MainInbox;
use App\Contracts\Work\PendingWorkSource;

/**
 * Counts the open navigation requests waiting for an actor: those main holds, for the actor seated there.
 */
final readonly class PendingNavigationWork implements PendingWorkSource
{
    public function __construct(private MainInbox $main) {}

    public function pendingCount(ActorIdentity $actor): int
    {
        return $this->main->openRequestsFor($actor);
    }
}
