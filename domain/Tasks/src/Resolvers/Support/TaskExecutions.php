<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Collection;

/**
 * The execution summary of a page of tasks, with every agent label read in one batch: no read per task.
 */
final readonly class TaskExecutions
{
    public function __construct(private ActorLabels $labels) {}

    /**
     * The execution of each task, keyed by task id; null for a task never started.
     *
     * @param  Collection<int, Task>  $tasks
     * @return array<string, TaskExecution|null>
     */
    public function of(Collection $tasks): array
    {
        $runners = array_values(array_filter($tasks->map(fn (Task $task) => $task->runner())->all()));
        $labels = $this->labels->labelsFor($runners);

        return $tasks->mapWithKeys(fn (Task $task) => [$task->id => $task->executionWith($labels)])->all();
    }
}
