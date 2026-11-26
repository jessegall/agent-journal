<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssignmentDestinationResolver as AssignmentDestinationResolverContract;
use App\Support\AssigneeIdentity;

/**
 * The assignee side of a recipient's destinations.
 */
final readonly class AssignmentDestinationResolver implements AssignmentDestinationResolverContract
{
    public function __construct(private DestinationRegistry $destinations) {}

    public function resolve(AssigneeIdentity $requested): Assignee
    {
        return $this->destinations->destinationsFor($requested)->assignee();
    }
}
