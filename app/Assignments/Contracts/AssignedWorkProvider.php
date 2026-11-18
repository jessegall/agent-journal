<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;

/**
 * Counts the unfinished records of its domain's assignable type an actor holds, hidden ones included.
 */
interface AssignedWorkProvider
{
    public function countFor(ActorIdentity $holder): int;
}
