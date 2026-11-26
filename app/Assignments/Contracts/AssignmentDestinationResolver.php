<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Exceptions\AssigneeUnavailable;
use App\Support\AssigneeIdentity;

/**
 * The assignee that holds work given to the requested recipient: the recipient itself, or the desk it forwards to.
 */
interface AssignmentDestinationResolver
{
    /**
     * @throws AssigneeUnavailable
     */
    public function resolve(AssigneeIdentity $requested): Assignee;
}
