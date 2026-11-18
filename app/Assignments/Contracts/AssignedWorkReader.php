<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;

/**
 * Counts the unfinished records of an assignable type an actor holds, through that type's work provider.
 */
interface AssignedWorkReader
{
    public function count(string $type, ActorIdentity $holder): int;
}
