<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignee;
use App\Contracts\AssignmentDestinationResolver;

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
