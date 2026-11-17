<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Readers;

use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Actors\Contracts\CurrentActor;
use App\Domain\Tasks\Api\TaskAssignmentCompletion;
use App\Domain\Tasks\Contracts\TaskAssignmentReader;
use App\Domain\Tasks\Enums\TaskState;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Reads tasks for another domain's assignments. Every agent and the user read every task, but a read needs someone
 * acting in this request.
 */
#[Scoped]
final readonly class TaskAssignmentRecords implements TaskAssignmentReader
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<int>  $taskIds
     * @return list<RecordIdentity>
     */
    public function records(array $taskIds): array
    {
        $states = $this->statesOf($taskIds);

        return array_map(fn (int $taskId) => new RecordIdentity(Task::LINK_TYPE, $taskId), array_keys($states));
    }

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<int>>  $taskGroups
     * @return array<TKey, TaskAssignmentCompletion>
     */
    public function completionOf(array $taskGroups): array
    {
        $states = $this->statesOf(array_merge(...array_values($taskGroups)));

        return array_map(fn (array $taskIds) => new TaskAssignmentCompletion(
            count($taskIds),
            count(array_filter($taskIds, fn (int $taskId) => ! $states[$taskId]->hasEnded())),
        ), $taskGroups);
    }

    /**
     * @param  list<int>  $taskIds
     * @return array<int, TaskState>
     *
     * @throws TaskMissing
     */
    private function statesOf(array $taskIds): array
    {
        $this->actors->actor();
        $wanted = array_values(array_unique($taskIds));
        $states = Task::query()->whereKey($wanted)->orderBy('id')->pluck('state', 'id')->all();

        foreach ($wanted as $taskId) {
            if (! array_key_exists($taskId, $states)) {
                throw TaskMissing::forId($taskId);
            }
        }

        return $states;
    }
}
