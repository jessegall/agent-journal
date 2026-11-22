<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Support\ActorIdentity;
use App\Contracts\AssignmentPool;
use App\Contracts\AssignmentPoolFactory;
use App\Enums\PoolInputType;
use App\Support\PoolDescription;
use App\Support\PoolMembers;
use App\Support\PoolReference;

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
