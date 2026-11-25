<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\ActorReference;

/**
 * Whether an actor of one type may be given work automatically now. Its owner answers it; a failure to find out is an
 * exception, never a quiet no.
 */
interface AutoAssignmentActivity
{
    /**
     * Whether the actor is active enough to be handed work automatically now.
     */
    public function mayTakeWork(ActorReference $actor): bool;
}
