<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Enums\PoolInputType;
use App\Assignments\PoolDescription;
use App\Assignments\PoolMembers;
use App\Support\ActorReference;
use App\Support\PoolReference;

/**
 * Opens the pool of every errand.
 */
final class OpenErrandPools implements AssignmentPoolFactory
{
    public function open(PoolReference $pool, ActorReference $assignee): AssignmentPool
    {
        return new class implements AssignmentPool
        {
            public function members(): PoolMembers
            {
                return PoolMembers::all();
            }
        };
    }

    public function validate(PoolReference $pool, ActorReference $assignee): void {}

    public function describe(PoolReference $pool, ActorReference $assignee): PoolDescription
    {
        return new PoolDescription('Open errands', 'Every errand nobody holds.', PoolInputType::None);
    }
}
