<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Enums\PoolInputType;
use App\Assignments\Support\PoolDescription;
use App\Assignments\Support\PoolMembers;
use App\Assignments\Support\PoolReference;

/**
 * Opens the pool of every errand.
 */
final class OpenErrandPools implements AssignmentPoolFactory
{
    public function open(PoolReference $pool, ActorIdentity $assignee): AssignmentPool
    {
        return new class implements AssignmentPool
        {
            public function members(): PoolMembers
            {
                return PoolMembers::all();
            }
        };
    }

    public function validate(PoolReference $pool, ActorIdentity $assignee): void {}

    public function describe(PoolReference $pool, ActorIdentity $assignee): PoolDescription
    {
        return new PoolDescription('Open errands', 'Every errand nobody holds.', PoolInputType::None);
    }
}
