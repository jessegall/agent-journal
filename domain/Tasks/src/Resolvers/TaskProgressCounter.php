<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Contracts\Actors\CurrentActor;
use Domain\Tasks\Contracts\TaskProgressCounter as TaskProgressCounterContract;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskProgress;
use Illuminate\Container\Attributes\Scoped;

/**
 * Counts the progress of the tasks another domain names by id, without that domain reading the tasks table. Every
 * agent and the user read every task, but a read needs someone acting in this request.
 */
#[Scoped]
final readonly class TaskProgressCounter implements TaskProgressCounterContract
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $ids
     */
    public function progressOf(array $ids): TaskProgress
    {
        $this->actors->actor();

        return $this->progressOfPlaced($ids);
    }

    /**
     * @param  list<string>  $ids
     */
    public function progressOfPlaced(array $ids): TaskProgress
    {
        $states = Task::query()->whereKey($ids)->readExactly(count($ids))->pluck('status')->countBy(
            fn (TaskStatus $state) => $state->value,
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

        $stateOfTask = Task::query()->whereKey($allTaskIds)->readExactly(
            count($allTaskIds),
        )->pluck('status', 'id')->all();

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
        $taskCounts = [...array_fill_keys(array_column(TaskStatus::cases(), 'value'), 0), ...$byState];

        return new TaskProgress(
            done: $taskCounts[TaskStatus::Finished->value],
            started: $taskCounts[TaskStatus::Started->value],
            blocked: $taskCounts[TaskStatus::Blocked->value],
            total: array_sum($taskCounts),
            cancelled: $taskCounts[TaskStatus::Cancelled->value],
        );
    }
}
