<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Support\AssigneeIdentity;

/**
 * Resolves the destinations of one registered type of assignee.
 */
interface DestinationProvider
{
    /**
     * @throws AssigneeUnavailable
     */
    public function destinationsFor(AssigneeIdentity $requested): Destinations;
}
