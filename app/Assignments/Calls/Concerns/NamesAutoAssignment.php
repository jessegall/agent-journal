<?php

declare(strict_types=1);

namespace App\Assignments\Calls\Concerns;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AutoAssignmentKey;

/**
 * A call about one actor's auto-assignment of one kind of record.
 */
trait NamesAutoAssignment
{
    public function key(): AutoAssignmentKey
    {
        return new AutoAssignmentKey(
            new ActorIdentity($this->actorType, strtolower($this->actorId)),
            $this->assignableType,
        );
    }
}
