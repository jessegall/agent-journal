<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Support\AssigneeIdentity;

/**
 * The assignee side of a recipient's destinations.
 */
final readonly class RegisteredAssignmentDestinations implements AssignmentDestinationResolver
{
    public function __construct(private DestinationRegistry $destinations) {}

    public function resolve(AssigneeIdentity $requested): Assignee
    {
        return $this->destinations->destinationsFor($requested)->assignee();
    }
}
