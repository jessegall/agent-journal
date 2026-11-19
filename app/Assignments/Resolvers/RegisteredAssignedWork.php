<?php

declare(strict_types=1);

namespace App\Assignments\Resolvers;

use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Support\AssigneeIdentity;

/**
 * Counts an actor's unfinished records of a type through the work provider its owner registered. A provider's failure
 * reaches the caller as it was thrown; nothing stands in for a count it could not give.
 */
final readonly class RegisteredAssignedWork implements AssignedWorkResolver
{
    public function __construct(private AssignmentProviders $providers) {}

    public function count(string $type, AssigneeIdentity $holder): int
    {
        return $this->providers->assignedWork($type)->countFor($holder);
    }
}
