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

        return TaskProgress::ofStates($states->all());
    }

    /**
     * The progress of each group of tasks, read with one query: a phase's tasks, a plan's tasks.
     *
     * @template TKey of array-key
     *
     * @param  array<TKey, list<int>>  $taskIdGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $taskIdGroups): array
    {
        $stateOfTask = Task::query()->whereKey(array_merge(...array_values($taskIdGroups)))->pluck('state', 'id')->all();

        return array_map(
            fn (array $taskIds) => TaskProgress::ofStates(array_count_values(array_map(
                fn (int $taskId) => $stateOfTask[$taskId]->value,
                array_values(array_filter($taskIds, fn (int $taskId) => isset($stateOfTask[$taskId]))),
            ))),
            $taskIdGroups,
        );
    }
}
