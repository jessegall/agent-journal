<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use App\Processes\Contracts\RunClaims;
use App\Stacks\Contracts\Work\AgentFocuses;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Values\TaskExecution;
use Illuminate\Support\Collection;
use PhpOption\Option;

/**
 * The execution summary of a page of tasks, with every agent label read in one batch: no read per task.
 */
final readonly class TaskExecutionReader
{
    public function __construct(
        private ActorLabels $labels,
        private RunClaims $claims,
        private AgentFocuses $focuses,
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

        $runners = array_map(fn (TaskRun $run) => $holders[$run->id] ?? $run->starter, $runs);

        $focusers = $this->focuses->focusersOf(
            array_values($tasks->map(fn (Task $task) => $task->focusIdentity())->all()),
        );

        $labels = $this->labels->labelsFor([...array_values($runners), ...array_values($focusers)]);

        $executions = [];

        foreach ($tasks as $task) {
            $runner = $runners[$task->id] ?? null;

            $executions[$task->id] = $runner === null ? null : $task->executionBy(
                $runner,
                $labels,
                isset($holders[$runs[$task->id]->id]),
                Option::fromArraysValue($focusers, $task->focusIdentity()->reference()),
            );
        }

        return $executions;
    }
}
