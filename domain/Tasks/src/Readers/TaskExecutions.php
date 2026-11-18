<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Actors\Enums\ActorType;
use App\Agents\Contracts\AgentReader;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Collection;

/**
 * The execution summary of a page of tasks, with every agent label read in one batch: no read per task.
 */
final readonly class TaskExecutions
{
    public function __construct(private AgentReader $agents) {}

    /**
     * The execution of each task, keyed by task id; null for a task never started.
     *
     * @param  Collection<int, Task>  $tasks
     * @return array<string, TaskExecution|null>
     */
    public function of(Collection $tasks): array
    {
        $labels = $this->agents->labelsFor(array_values(array_unique(array_filter($tasks->filter(fn (Task $task): bool => $task->run_actor_type === ActorType::Agent)->pluck('run_actor_id')->all(), is_string(...)))));

        return $tasks->mapWithKeys(fn (Task $task): array => [$task->id => $task->executionWith($labels)])->all();
    }
}
