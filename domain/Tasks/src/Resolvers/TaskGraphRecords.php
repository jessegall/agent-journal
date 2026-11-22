<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Api\TaskGraph;
use Domain\Tasks\Api\TaskGraphEdge;
use Domain\Tasks\Api\TaskGraphNode;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Optional;

/**
 * Builds the graph of a plan's tasks from the waits the task readers already use: the direct waits of those tasks,
 * kept when both ends are in the plan, and each task's own permission to change its waits.
 */
final readonly class TaskGraphRecords implements TaskGraphResolver
{
    public function __construct(
        private TaskResolver $visibility,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function graphOf(string $planId, array $taskIds, string $selectedId, string $returnAddress): TaskGraph
    {
        $this->visibility->requireAllVisible($taskIds);

        $tasks = Task::ofIds($taskIds);
        $inPlan = array_flip($taskIds);

        $edges = $taskIds === [] ? [] : array_values(array_map(
            fn (TaskWait $wait) => new TaskGraphEdge(
                $wait->prerequisite_task_id,
                $wait->dependent_task_id,
                $wait->isSatisfiedBy($tasks[$wait->prerequisite_task_id]->state ?? null),
            ),
            array_filter(
                TaskWait::waitsOfTasks($taskIds)->all(),
                fn (TaskWait $wait) => isset($inPlan[$wait->prerequisite_task_id]),
            ),
        ));

        $nodes = array_values(array_map(fn (Task $task) => $this->nodeOf($task), $tasks));

        return new TaskGraph(
            $planId,
            $this->versionOf($nodes, $edges),
            $nodes,
            $edges,
            $returnAddress,
            $selectedId,
        );
    }

    /**
     * A version that changes when a task's state or a wait does.
     *
     * @param  list<TaskGraphNode>  $nodes
     * @param  list<TaskGraphEdge>  $edges
     */
    private function versionOf(array $nodes, array $edges): string
    {
        $states = array_map(fn (TaskGraphNode $node) => [$node->id, $node->state->value], $nodes);
        $waits = array_map(
            fn (TaskGraphEdge $edge) => [$edge->prerequisiteId, $edge->dependentId, $edge->isSatisfied],
            $edges,
        );

        return hash('sha256', json_encode([$states, $waits], JSON_THROW_ON_ERROR));
    }

    private function nodeOf(Task $task): TaskGraphNode
    {
        $allowed = $this->authorizer->filterActions(TaskPolicy::class, $task, [AccessType::Edit]);
        $mayEdit = ! $task->state->hasEnded() && in_array(AccessType::Edit, $allowed, true);

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
