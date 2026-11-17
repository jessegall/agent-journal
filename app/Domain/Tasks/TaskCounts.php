<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Domain\Tasks\Models\Task;

/**
 * Counts the progress of the tasks another domain names by id, without that domain reading the tasks table.
 */
final readonly class TaskCounts
{
    /**
     * @param  list<int>  $taskIds
     */
    public function progressOf(array $taskIds): TaskProgress
    {
        $states = Task::query()->whereKey($taskIds)->pluck('state')->countBy(fn (TaskState $state) => $state->value);

        return new TaskProgress(
            done: $states->get(TaskState::Finished->value, 0),
            started: $states->get(TaskState::Started->value, 0),
            blocked: $states->get(TaskState::Blocked->value, 0),
            total: $states->sum(),
        );
    }
}
