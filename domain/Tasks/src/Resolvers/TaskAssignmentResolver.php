<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Support\RecordIdentity;
use Domain\Tasks\Contracts\TaskAssignmentResolver as TaskAssignmentResolverContract;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskAssignmentCompletion;
use Illuminate\Container\Attributes\Scoped;

/**
 * Reads tasks for another domain's assignments. Every agent and the user read every task, but a read needs someone
 * acting in this request.
 */
#[Scoped]
final readonly class TaskAssignmentResolver implements TaskAssignmentResolverContract
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $ids
     * @return list<RecordIdentity>
     */
    public function records(array $ids): array
    {
        $states = $this->statesOf($ids);

        return array_map(fn (string $taskId) => new RecordIdentity(Task::linkType(), $taskId), array_keys($states));
    }

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $groups
     * @return array<TKey, TaskAssignmentCompletion>
     */
    public function completionOf(array $groups): array
    {
        $states = $this->statesOf(array_merge(...array_values($groups)));

        return array_map(fn (array $taskIds) => new TaskAssignmentCompletion(
            count($taskIds),
            count(array_filter($taskIds, fn (string $taskId) => ! $states[$taskId]->hasEnded())),
        ), $groups);
    }

    /**
     * @param  list<string>  $ids
     * @return array<string, TaskState>
     *
     * @throws TaskMissing
     */
    private function statesOf(array $ids): array
    {
        $this->actors->actor();
        $requestedTaskIds = array_values(array_unique($ids));

        $states = Task::query()->whereKey($requestedTaskIds)->readExactly(
            count($requestedTaskIds),
        )->oldestFirst()->pluck('state', 'id')->all();

        foreach ($requestedTaskIds as $taskId) {
            if (! array_key_exists($taskId, $states)) {
                throw TaskMissing::forId($taskId);
            }
        }

        return $states;
    }
}
