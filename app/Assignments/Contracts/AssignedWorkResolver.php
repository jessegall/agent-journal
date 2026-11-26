<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Support\AssigneeIdentity;

/**
 * Counts the unfinished records of an assignable type an actor holds, through that type's work provider.
 */
interface AssignedWorkResolver
{
    /**
     * How many records of the type the holder has assigned.
     */
    public function count(string $type, AssigneeIdentity $holder): int;
}
