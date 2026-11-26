<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\PoolDescription;
use App\Support\ActorReference;
use App\Support\PoolReference;

/**
 * Checks, describes and opens the pools of one pool key for the actor who receives their records.
 */
interface AssignmentPoolFactory
{
    /**
     * The pool, ready to hand work to the assignee's members.
     */
    public function open(PoolReference $pool, ActorReference $assignee): AssignmentPool;

    /**
     * Fails, with a named exception, when the reference does not fit this pool or the actor may not draw from it.
     */
    public function validate(PoolReference $pool, ActorReference $assignee): void;

    /**
     * The pool as the settings page shows it for the assignee.
     */
    public function describe(PoolReference $pool, ActorReference $assignee): PoolDescription;
}
