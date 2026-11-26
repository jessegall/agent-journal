<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Support\AssigneeIdentity;

/**
 * Counts the unfinished records of its domain's assignable type an actor holds, hidden ones included.
 */
interface AssignedWorkProvider
{
    /**
     * How many records of the provider's type the holder has assigned.
     */
    public function countFor(AssigneeIdentity $holder): int;
}
