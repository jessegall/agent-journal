<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\Assignee;
use App\Contracts\Assignments\AssignmentDestinationResolver as AssignmentDestinationResolverContract;

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
