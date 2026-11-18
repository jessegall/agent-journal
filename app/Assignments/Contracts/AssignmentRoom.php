<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AutoAssignmentFact;

/**
 * How many more items an auto-assignment may give its actor, given how many unfinished ones the actor holds. Core
 * keeps the answer between 0 and the configured size.
 */
interface AssignmentRoom
{
    public function available(AutoAssignmentFact $fact, int $held): int;
}
