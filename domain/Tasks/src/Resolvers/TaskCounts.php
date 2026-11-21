<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

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
     * @param  list<string>  $ids
     */
    public function progressOf(array $ids): TaskProgress
    {
        $this->actors->actor();

        $states = Task::query()->whereKey($ids)->readExactly(count($ids))->pluck('state')->countBy(
            fn (TaskState $state) => $state->value,
        );

        return self::progressOfStates($states->all());
    }

    /**
     * The progress of each group of tasks, read with one query: a phase's tasks, a plan's tasks.
     *
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $idGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $idGroups): array
    {
        $this->actors->actor();
        $allTaskIds = array_merge(...array_values($idGroups));
        $stateOfTask = Task::query()->whereKey($allTaskIds)->readExactly(count($allTaskIds))->pluck('state', 'id')->all();

        return array_map(
            fn (array $taskIds) => self::progressOfStates(array_count_values(array_map(
                fn (string $taskId) => $stateOfTask[$taskId]->value,
                array_values(array_filter($taskIds, fn (string $taskId) => isset($stateOfTask[$taskId]))),
            ))),
            $idGroups,
        );
    }

    /**
     * @param  array<array-key, int>  $byState  Counts by state value, omitting states with no tasks.
     */
    private static function progressOfStates(array $byState): TaskProgress
    {
        $taskCounts = [...array_fill_keys(array_column(TaskState::cases(), 'value'), 0), ...$byState];

        return new TaskProgress(
            done: $taskCounts[TaskState::Finished->value],
            started: $taskCounts[TaskState::Started->value],
            blocked: $taskCounts[TaskState::Blocked->value],
            total: array_sum($taskCounts),
            cancelled: $taskCounts[TaskState::Cancelled->value],
        );
    }
}
