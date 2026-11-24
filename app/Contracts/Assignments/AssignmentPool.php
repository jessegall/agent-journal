<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\PoolMembers;

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
