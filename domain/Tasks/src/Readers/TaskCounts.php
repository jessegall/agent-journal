<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Actors\Contracts\CurrentActor;
use Domain\Tasks\Api\TaskProgress;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Counts the progress of the tasks another domain names by id, without that domain reading the tasks table. Every
 * agent and the user read every task, but a read needs someone acting in this request.
 */
#[Scoped]
final readonly class TaskCounts implements TaskProgressCounter
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $taskIds
     */
    public function progressOf(array $taskIds): TaskProgress
    {
        $this->actors->actor();
        $states = Task::query()->whereKey($taskIds)->readLimit(count($taskIds))->pluck('state')->countBy(fn (TaskState $state) => $state->value);

        return self::progressOfStates($states->all());
    }

    /**
     * The progress of each group of tasks, read with one query: a phase's tasks, a plan's tasks.
     *
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $taskIdGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $taskIdGroups): array
    {
        $this->actors->actor();
        $allTaskIds = array_merge(...array_values($taskIdGroups));
        $stateOfTask = Task::query()->whereKey($allTaskIds)->readLimit(count($allTaskIds))->pluck('state', 'id')->all();

        return array_map(
            fn (array $taskIds) => self::progressOfStates(array_count_values(array_map(
                fn (string $taskId) => $stateOfTask[$taskId]->value,
                array_values(array_filter($taskIds, fn (string $taskId) => isset($stateOfTask[$taskId]))),
            ))),
            $taskIdGroups,
        );
    }

    /**
     * @param  array<array-key, int>  $countOfState  how many tasks are in each state, by the state's value; a state
     *                                               with no tasks may be left out
     */
    private static function progressOfStates(array $countOfState): TaskProgress
    {
        $count = [...array_fill_keys(array_column(TaskState::cases(), 'value'), 0), ...$countOfState];

        return new TaskProgress(
            done: $count[TaskState::Finished->value],
            started: $count[TaskState::Started->value],
            blocked: $count[TaskState::Blocked->value],
            total: array_sum($count),
            cancelled: $count[TaskState::Cancelled->value],
        );
    }
}
