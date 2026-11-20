<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Api\TaskAssignmentCompletion;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Reads tasks for another domain's assignments. Every agent and the user read every task, but a read needs someone
 * acting in this request.
 */
#[Scoped]
final readonly class TaskAssignmentRecords implements TaskAssignmentResolver
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $taskIds
     * @return list<RecordIdentity>
     */
    public function records(array $taskIds): array
    {
        $states = $this->statesOf($taskIds);

        return array_map(fn (string $taskId) => new RecordIdentity(Task::LINK_TYPE, $taskId), array_keys($states));
    }

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $taskGroups
     * @return array<TKey, TaskAssignmentCompletion>
     */
    public function completionOf(array $taskGroups): array
    {
        $states = $this->statesOf(array_merge(...array_values($taskGroups)));

        return array_map(fn (array $taskIds) => new TaskAssignmentCompletion(
            count($taskIds),
            count(array_filter($taskIds, fn (string $taskId) => ! $states[$taskId]->hasEnded())),
        ), $taskGroups);
    }

    /**
     * @param  list<string>  $taskIds
     * @return array<string, TaskState>
     *
     * @throws TaskMissing
     */
    private function statesOf(array $taskIds): array
    {
        $this->actors->actor();
        $requestedTaskIds = array_values(array_unique($taskIds));
        $states = Task::query()->whereKey($requestedTaskIds)->readLimit(
            count($requestedTaskIds),
        )->orderBy('id')->pluck('state', 'id')->all();

        foreach ($requestedTaskIds as $taskId) {
            if (! array_key_exists($taskId, $states)) {
                throw TaskMissing::forId($taskId);
            }
        }

        return $states;
    }
}
