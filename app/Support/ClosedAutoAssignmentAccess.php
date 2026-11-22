<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Exceptions\AutoAssignmentDenied;

/**
 * The policy while nothing else is bound: nobody may read or change an auto-assignment.
 */
final readonly class ClosedAutoAssignmentAccess implements AutoAssignmentAccess
{
    public function assertMayRead(Actor $actor, ActorIdentity $target): void
    {
        throw AutoAssignmentDenied::forRead($actor);
    }

    public function assertMayWrite(Actor $actor, ActorIdentity $target): void
    {
        throw AutoAssignmentDenied::forWrite($actor);
    }

    public function mayReadTotals(Actor $actor, ActorIdentity $target): bool
    {
        return false;
    }
}
