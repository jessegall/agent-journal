<?php

declare(strict_types=1);

namespace App\Navigation;

use App\Contracts\Work\PendingWorkSource;
use App\Inboxes\Contracts\MainInbox;
use App\Support\ActorReference;

/**
 * Counts the open navigation requests waiting for an actor: those main holds, for the actor seated there.
 */
final readonly class PendingNavigationWork implements PendingWorkSource
{
    public function __construct(private MainInbox $main) {}

    public function pendingCount(ActorReference $actor): int
    {
        return $this->main->openRequestsFor($actor);
    }
}
