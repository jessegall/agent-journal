<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssigneeIdentity;

/**
 * Counts the unfinished records of its domain's assignable type an actor holds, hidden ones included.
 */
interface AssignedWorkProvider
{
    public function countFor(AssigneeIdentity $holder): int;
}
