<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AutoAssignmentDenied;

/**
 * The policy while nothing else is bound: nobody may read or change an auto-assignment.
 */
final readonly class DenyAllAutoAssignmentAccess implements AutoAssignmentAccess
{
    public function requireRead(Actor $actor, ActorIdentity $target): void
    {
        throw AutoAssignmentDenied::forRead($actor);
    }

    public function requireWrite(Actor $actor, ActorIdentity $target): void
    {
        throw AutoAssignmentDenied::forWrite($actor);
    }

    public function mayReadTotals(Actor $actor, ActorIdentity $target): bool
    {
        return false;
    }
}
