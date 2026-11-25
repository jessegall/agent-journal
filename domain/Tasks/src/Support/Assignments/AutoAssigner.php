<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AssignmentQuery;
use App\Contracts\Assignments\AutoAssigner as AutoAssignerContract;
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
final readonly class AutoAssigner implements AutoAssignerContract
{
    public function __construct(private AssignmentQuery $assignments) {}

    public function pick(ActorIdentity $assignee, AssignmentPool $pool, int $room): OrderedRecordIds
    {
        return Task::resolveCandidates($pool->members(), $this->assignments->assignedIds(TaskType::linkType()), $room);
    }

    /**
     * @throws TaskMissing
     * @throws TaskNotOpenForAssignment
     */
    public function requireCandidate(RecordIdentity $record): void
    {
        $task = Task::findLockedById($record->id);

        if (! $task->isOpenForAssignment()) {
            throw TaskNotOpenForAssignment::forTask($task->number, $task->status->value);
        }
    }
}
