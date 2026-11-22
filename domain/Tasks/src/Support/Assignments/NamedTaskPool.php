<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\AssignmentPool;
use App\Support\PoolMembers;

/**
 * The tasks a reference listed, in its order; a task that ended stays a member, and the assigner skips it.
 */
final readonly class NamedTaskPool implements AssignmentPool
{
    public function __construct(private PoolMembers $members) {}

    public function members(): PoolMembers
    {
        return $this->members;
    }
}
