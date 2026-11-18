<?php

declare(strict_types=1);

namespace Domain\Plans\Assignments;

use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Support\PoolMembers;

/**
 * The tasks of a started plan, phase by phase and in each phase's order, as read when the pool was opened.
 */
final readonly class PlanTaskPool implements AssignmentPool
{
    public function __construct(private PoolMembers $members) {}

    public function members(): PoolMembers
    {
        return $this->members;
    }
}
