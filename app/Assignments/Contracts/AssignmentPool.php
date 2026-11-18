<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\PoolMembers;

/**
 * The records an auto-assignment draws from, opened by its pool factory for one pass.
 */
interface AssignmentPool
{
    public function members(): PoolMembers;
}
