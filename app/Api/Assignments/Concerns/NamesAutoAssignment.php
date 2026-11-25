<?php

declare(strict_types=1);

namespace App\Api\Assignments\Concerns;

use App\Support\ActorReference;
use App\Support\AutoAssignmentKey;

/**
 * A call about one actor's auto-assignment of one kind of record.
 */
trait NamesAutoAssignment
{
    public function key(): AutoAssignmentKey
    {
        return new AutoAssignmentKey(
            ActorReference::fromStored($this->actorType, strtolower($this->actorId)),
            $this->assignableType,
        );
    }
}
