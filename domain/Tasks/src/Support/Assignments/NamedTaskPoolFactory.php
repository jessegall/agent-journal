<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AssignmentPoolFactory;
use App\Enums\PoolInputType;
use App\Support\ActorIdentity;
use App\Support\PoolDescription;
use App\Support\PoolMembers;
use App\Support\PoolReference;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskPoolRefused;
use Illuminate\Container\Attributes\Scoped;

/**
 * The pool tasks.named: the 1 to 1,000 tasks a reference lists, in its order. Every listed task must exist and be
 * readable, when the pool is set up and each time it is opened; one that is not refuses the whole pool.
 */
#[Scoped]
final readonly class NamedTaskPoolFactory implements AssignmentPoolFactory
{
    public const string KEY = 'tasks.named';

    public function __construct(private TaskAssignmentResolver $tasks) {}

    /**
     * @throws TaskPoolRefused
     * @throws TaskMissing
     */
    public function open(PoolReference $pool, ActorIdentity $assignee): AssignmentPool
    {
        $this->validate($pool, $assignee);

        return new NamedTaskPool(PoolMembers::ordered($pool->recordIds));
    }

    /**
     * @throws TaskPoolRefused
     * @throws TaskMissing
     */
    public function validate(PoolReference $pool, ActorIdentity $assignee): void
    {
        if ($pool->type !== self::KEY) {
            throw TaskPoolRefused::otherPool(self::KEY);
        }

        if ($pool->target !== null) {
            throw TaskPoolRefused::targetGiven(self::KEY);
        }

        if ($pool->recordIds === []) {
            throw TaskPoolRefused::noIds(self::KEY);
        }

        $this->tasks->records($pool->recordIds);
    }

    public function describe(PoolReference $pool, ActorIdentity $assignee): PoolDescription
    {
        return new PoolDescription('Named tasks', 'The listed tasks, in the order listed.', PoolInputType::RecordIds);
    }
}
