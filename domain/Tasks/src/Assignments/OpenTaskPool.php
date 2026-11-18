<?php

declare(strict_types=1);

namespace Domain\Tasks\Assignments;

use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Support\PoolMembers;

/**
 * Every task, without listing them: the assigner picks the open ones nobody holds.
 */
final readonly class OpenTaskPool implements AssignmentPool
{
    public function members(): PoolMembers
    {
        return PoolMembers::all();
    }
}
