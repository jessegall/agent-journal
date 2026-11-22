<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\AssigneeUnavailable;
use App\Support\AssigneeIdentity;

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
