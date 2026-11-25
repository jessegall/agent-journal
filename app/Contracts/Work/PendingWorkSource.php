<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorReference;

/**
 * Counts the work waiting for an actor in one module, such as its unread incoming messages: a count, never content.
 */
interface PendingWorkSource
{
    /**
     * How much work of this source waits for the actor.
     */
    public function pendingCount(ActorReference $actor): int;
}
