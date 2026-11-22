<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\AssignmentPool;
use App\Contracts\AssignmentQuery;
use App\Contracts\AutoAssigner;
use App\Support\ActorIdentity;
use App\Support\OrderedRecordIds;
use App\Support\RecordIdentity;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskNotOpenForAssignment;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
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
        $task = Task::lockedById($record->id);

        if (! $task->isOpenForAssignment()) {
            throw TaskNotOpenForAssignment::forTask($task->number, $task->state->value);
        }
    }
}
