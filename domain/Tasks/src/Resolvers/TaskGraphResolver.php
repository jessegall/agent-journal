<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Contracts\TaskGraphResolver as TaskGraphResolverContract;
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
final readonly class TaskGraphResolver implements TaskGraphResolverContract
{
    public function __construct(
        private TaskResolver $visibility,
        private TaskWaitRules $rules,
        private TaskGraphVersion $version,
    ) {}

    public function graphOf(string $planId, array $ids, string $selectedId, string $returnAddress): TaskGraph
    {
        $this->visibility->requireAllVisible($ids);

        $tasks = Task::findForIds($ids);

        $waits = TaskWait::findWithin($ids);

        $edges = array_map(
            fn (TaskWait $wait) => new TaskGraphEdge(
                $wait->prerequisite_task_id,
                $wait->dependent_task_id,
                $wait->isSatisfiedBy($tasks[$wait->prerequisite_task_id]->state ?? null),
            ),
            $waits,
        );

        $nodes = array_values(array_map(fn (Task $task) => $this->nodeOf($task), $tasks));

        return TaskGraph::from(
            [
                'planId' => $planId,
                'version' => $this->version->of($tasks, $waits),
                'nodes' => $nodes,
                'edges' => $edges,
                'returnAddress' => $returnAddress,
                'selectedId' => $selectedId,
            ],
        );
    }

    private function nodeOf(Task $task): TaskGraphNode
    {
        $mayEdit = $this->rules->mayChange($task);

        return TaskGraphNode::from(
            [
                'id' => $task->id,
                'number' => $task->number,
                'title' => $task->title,
                'status' => $task->status,
                'address' => "/tasks/{$task->number}",
                'mayEditWaits' => $mayEdit,
                'reason' => $mayEdit ? Optional::create() : $this->reasonFor($task),
            ],
        );
    }

    private function reasonFor(Task $task): string
    {
        if ($task->status->hasEnded()) {
            return "Task {$task->number} has ended, so its waits no longer change.";
        }

        return 'You may not change the waits of this task.';
    }
}
