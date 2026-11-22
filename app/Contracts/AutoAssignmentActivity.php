<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;

/**
 * Whether an actor of one type may be given work automatically now. Its owner answers it; a failure to find out is an
 * exception, never a quiet no.
 */
interface AutoAssignmentActivity
{
    public function mayTakeWork(ActorIdentity $actor): bool;
}
