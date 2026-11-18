<?php

declare(strict_types=1);

namespace App\Assignments\Readers;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignedWorkReader;
use App\Assignments\Contracts\AssignmentProviders;

/**
 * Counts an actor's unfinished records of a type through the work provider its owner registered. A provider's failure
 * reaches the caller as it was thrown; nothing stands in for a count it could not give.
 */
final readonly class RegisteredAssignedWork implements AssignedWorkReader
{
    public function __construct(private AssignmentProviders $providers) {}

    public function count(string $type, ActorIdentity $holder): int
    {
        return $this->providers->assignedWork($type)->countFor($holder);
    }
}
