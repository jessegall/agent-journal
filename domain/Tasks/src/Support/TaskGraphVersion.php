<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;

/**
 * The version of a plan's task graph: it changes when a task's state or a wait does, so a change made against an older
 * version can be refused.
 */
final readonly class TaskGraphVersion
{
    /**
     * @param  array<string, Task>  $tasks  the plan's tasks by id, in the graph's order
     * @param  list<TaskWait>  $waits  the waits between them
     */
    public function of(array $tasks, array $waits): string
    {
        $states = array_values(array_map(fn (Task $task) => [
            $task->id,
            $task->state->value,
        ], $tasks));

        $edges = array_map(
            fn (TaskWait $wait) => [
                $wait->prerequisite_task_id,
                $wait->dependent_task_id,
                $wait->isSatisfiedBy($tasks[$wait->prerequisite_task_id]->state ?? null),
            ],
            $waits,
        );

        // Rows come back in no fixed order, so the same graph must hash the same whatever order it was read in.
        sort($states);
        sort($edges);

        return hash('sha256', json_encode([
            $states,
            $edges,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * The version of these tasks' graph as it is stored now.
     *
     * @param  list<string>  $ids
     */
    public function current(array $ids): string
    {
        return $this->of(Task::findForIds($ids), TaskWait::findWithin($ids));
    }
}
