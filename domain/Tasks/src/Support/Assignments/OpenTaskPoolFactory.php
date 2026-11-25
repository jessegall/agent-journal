<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AssignmentPoolFactory;
use App\Enums\Assignments\PoolInputType;
use App\Support\ActorIdentity;
use App\Support\PoolDescription;
use App\Support\PoolReference;
use Domain\Tasks\Exceptions\TaskPoolRefused;
use Illuminate\Container\Attributes\Scoped;

/**
 * The pool tasks.open: every open task nobody holds, with no target and no list.
 */
#[Scoped]
final readonly class OpenTaskPoolFactory implements AssignmentPoolFactory
{
    public const string KEY = 'tasks.open';

    /**
     * @throws TaskPoolRefused
     */
    public function open(PoolReference $pool, ActorIdentity $assignee): AssignmentPool
    {
        $this->validate($pool, $assignee);

        return new OpenTaskPool();
    }

    /**
     * @throws TaskPoolRefused
     */
    public function validate(PoolReference $pool, ActorIdentity $assignee): void
    {
        if ($pool->type !== self::KEY) {
            throw TaskPoolRefused::otherPool(self::KEY);
        }

        if ($pool->target !== null) {
            throw TaskPoolRefused::targetGiven(self::KEY);
        }

        if ($pool->recordIds !== []) {
            throw TaskPoolRefused::idsGiven(self::KEY);
        }
    }

    public function describe(PoolReference $pool, ActorIdentity $assignee): PoolDescription
    {
        return new PoolDescription('Open tasks', 'Every open task nobody holds, oldest first.', PoolInputType::None);
    }
}
