<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use App\Desks\Contracts\RunClaims;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Illuminate\Support\Collection;

/**
 * The execution summary of a page of tasks, with every agent label read in one batch: no read per task.
 */
final readonly class TaskExecutions
{
    public function __construct(
        private ActorLabels $labels,
        private RunClaims $claims,
    ) {}

    /**
     * The execution of each task, keyed by task id; null for a task never started.
     *
     * @param  Collection<int, Task>  $tasks
     * @return array<string, TaskExecution|null>
     */
    public function of(Collection $tasks): array
    {
        $runs = array_filter($tasks->mapWithKeys(fn (Task $task) => [$task->id => $task->currentRun()])->all());

        $holders = $this->claims->holdersOf(
            array_values(array_map(fn (TaskRun $run) => $run->assignmentIdentity(), $runs)),
        );

        $runners = array_map(fn (TaskRun $run) => $holders[$run->id] ?? $run->starter(), $runs);
        $labels = $this->labels->labelsFor(array_values($runners));

        return $tasks->mapWithKeys(fn (Task $task) => [
            $task->id => isset($runners[$task->id]) ? $task->executionBy($runners[$task->id], $labels) : null,
        ])->all();
    }
}
