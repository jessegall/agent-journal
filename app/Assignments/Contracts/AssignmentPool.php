<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\PoolMembers;

/**
 * The records an auto-assignment draws from, opened by its pool factory for one pass.
 */
interface AssignmentPool
{
    /**
     * The assignees the pool may hand work to, in the order it tries them.
     */
    public function members(): PoolMembers;
}
