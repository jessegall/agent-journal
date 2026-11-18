<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Agents\Contracts\AgentReader;
use App\Agents\Support\AgentLabel;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Models\Task;

/**
 * The execution summary of a page of tasks, with every agent label read in one batch: no read per task.
 */
final readonly class TaskExecutions
{
    public function __construct(private AgentReader $agents) {}

    /**
     * The execution of each task that has a run, keyed by task id.
     *
     * @param  iterable<Task>  $tasks
     * @return array<string, TaskExecution>
     */
    public function of(iterable $tasks): array
    {
        $running = [];

        foreach ($tasks as $task) {
            if ($task->run_agent_id !== null && $task->run_session_id !== null) {
                $running[$task->id] = $task;
            }
        }

        $labels = $this->agents->labelsFor(array_values(array_unique(array_map(fn (Task $task): string => (string) $task->run_agent_id, $running))));

        return array_map(fn (Task $task): TaskExecution => new TaskExecution(
            (string) $task->run_agent_id,
            ($labels[(string) $task->run_agent_id] ?? new AgentLabel((string) $task->run_agent_id, 'an agent'))->name,
            (string) $task->run_session_id,
            $task->run_number,
            $task->state->workState(),
        ), $running);
    }
}
