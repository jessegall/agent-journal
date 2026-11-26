<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AutoAssignmentDenied;

/**
 * The policy while nothing else is bound: nobody may read or change an auto-assignment.
 */
final readonly class ClosedAutoAssignmentAccess implements AutoAssignmentAccess
{
    public function assertMayRead(Actor $actor, ActorReference $target): void
    {
        throw AutoAssignmentDenied::forRead($actor);
    }

    public function assertMayWrite(Actor $actor, ActorReference $target): void
    {
        throw AutoAssignmentDenied::forWrite($actor);
    }

    public function mayReadTotals(Actor $actor, ActorReference $target): bool
    {
        return false;
    }
}
