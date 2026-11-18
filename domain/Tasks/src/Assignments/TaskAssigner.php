<?php

declare(strict_types=1);

namespace Domain\Tasks\Assignments;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Support\OrderedRecordIds;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskNotOpenForAssignment;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Picks the open tasks nobody holds from a pool, in the pool's order, and confirms one is still open when it is
 * claimed. Who receives them is no concern of it.
 */
#[Scoped]
final readonly class TaskAssigner implements AutoAssigner
{
    public function __construct(private AssignmentQuery $assignments) {}

    public function pick(ActorIdentity $assignee, AssignmentPool $pool, int $room): OrderedRecordIds
    {
        return Task::candidates($pool->members(), $this->assignments->assignedIds(TaskType::VALUE), $room);
    }

    /**
     * @throws TaskMissing
     * @throws TaskNotOpenForAssignment
     */
    public function requireCandidate(RecordIdentity $record): void
    {
        Task::lockedById($record->id)->requireOpenForAssignment();
    }
}
