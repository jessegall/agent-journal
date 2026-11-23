<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Contracts\TaskGraphResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Data\TaskGraphEdge;
use Domain\Tasks\Data\TaskGraphNode;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Support\TaskGraphVersion;
use Domain\Tasks\Support\TaskWaitRules;
use Spatie\LaravelData\Optional;

/**
 * Builds the graph of a plan's tasks from the waits the task readers already use: the direct waits of those tasks,
 * kept when both ends are in the plan, and each task's own permission to change its waits.
 */
final readonly class TaskGraphRecords implements TaskGraphResolver
{
    public function __construct(
        private TaskResolver $visibility,
        private TaskWaitRules $rules,
        private TaskGraphVersion $version,
    ) {}

    public function graphOf(string $planId, array $ids, string $selectedId, string $returnAddress): TaskGraph
    {
        $this->visibility->requireAllVisible($ids);

        $tasks = Task::ofIds($ids);

        $waits = TaskWait::within($ids);

        $edges = array_map(
            fn (TaskWait $wait) => new TaskGraphEdge(
                $wait->prerequisite_task_id,
                $wait->dependent_task_id,
                $wait->isSatisfiedBy($tasks[$wait->prerequisite_task_id]->state ?? null),
            ),
            $waits,
        );

        $nodes = array_values(array_map(fn (Task $task) => $this->nodeOf($task), $tasks));

        return new TaskGraph(
            $planId,
            $this->version->of($tasks, $waits),
            $nodes,
            $edges,
            $returnAddress,
            $selectedId,
        );
    }

    private function nodeOf(Task $task): TaskGraphNode
    {
        $mayEdit = $this->rules->mayChange($task);

        return new TaskGraphNode(
            $task->id,
            $task->number,
            $task->title,
            $task->state,
            "/tasks/{$task->number}",
            $mayEdit,
            $mayEdit ? new Optional() : $this->reasonFor($task),
        );
    }

    private function reasonFor(Task $task): string
    {
        return $task->state->hasEnded()
            ? "Task {$task->number} has ended, so its waits no longer change."
            : 'You may not change the waits of this task.';
    }
}
