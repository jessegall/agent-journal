<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;
use App\Support\PoolDescription;
use App\Support\PoolReference;

/**
 * Checks, describes and opens the pools of one pool key for the actor who receives their records.
 */
interface AssignmentPoolFactory
{
    public function open(PoolReference $pool, ActorIdentity $assignee): AssignmentPool;

    /**
     * Fails, with a named exception, when the reference does not fit this pool or the actor may not draw from it.
     */
    public function validate(PoolReference $pool, ActorIdentity $assignee): void;

    public function describe(PoolReference $pool, ActorIdentity $assignee): PoolDescription;
}
