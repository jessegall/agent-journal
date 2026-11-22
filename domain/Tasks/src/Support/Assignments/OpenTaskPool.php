<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Support\PoolMembers;

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
