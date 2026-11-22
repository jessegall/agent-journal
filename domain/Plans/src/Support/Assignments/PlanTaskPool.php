<?php

declare(strict_types=1);

namespace Domain\Plans\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Support\PoolMembers;

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
