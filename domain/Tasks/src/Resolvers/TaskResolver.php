<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Projects\Contracts\ProjectOwned;
use Domain\Tasks\Contracts\TaskResolver as TaskResolverContract;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskSummary;
use Illuminate\Container\Attributes\Scoped;

/**
 * Checks tasks for the actor of this request, all ids in one read. Every agent and the user read every task.
 */
#[Scoped]
final readonly class TaskResolver implements TaskResolverContract
{
    public function __construct(private CurrentActor $actors) {}

    public function requireVisible(string $taskId): void
    {
        $this->requireAllVisible([$taskId]);
    }

    /**
     * @param  list<string>  $ids
     */
    public function requireAllVisible(array $ids): void
    {
        $this->actors->actor();
        $requestedTaskIds = array_values(array_unique($ids));

        $visibleTaskIds = array_values(array_map(
            strval(...),
            Task::query()->whereKey($requestedTaskIds)->readExactlyOf($requestedTaskIds)->pluck('id')->all(),
        ));

        $this->assertAllFound($requestedTaskIds, $visibleTaskIds);
    }

    public function requireAllVisibleBeside(array $ids, ProjectOwned $joined): void
    {
        $this->actors->actor();
        $requestedTaskIds = array_values(array_unique($ids));
        $tasks = Task::query()->whereKey($requestedTaskIds)->readExactlyOf($requestedTaskIds)->get();
        $this->assertAllFound($requestedTaskIds, array_values(array_map(strval(...), $tasks->modelKeys())));

        foreach ($tasks as $task) {
            $task->assertSameProjectAs($joined);
        }
    }

    /**
     * @param  list<string>  $ids
     * @return list<TaskSummary>
     */
    public function summaries(array $ids): array
    {
        $this->actors->actor();
        $requestedTaskIds = array_values(array_unique($ids));
        $tasks = Task::query()->whereKey($requestedTaskIds)->readExactlyOf($requestedTaskIds)->get()->keyBy('id');
        $this->assertAllFound($requestedTaskIds, array_values(array_map(strval(...), $tasks->keys()->all())));

        return array_map(fn (string $taskId) => $tasks[$taskId]->summary, $ids);
    }

    /**
     * @param  list<string>  $requestedTaskIds
     * @param  list<string>  $visibleTaskIds
     */
    private function assertAllFound(array $requestedTaskIds, array $visibleTaskIds): void
    {
        $unavailableTaskIds = array_values(array_diff($requestedTaskIds, $visibleTaskIds));

        if ($unavailableTaskIds !== []) {
            throw TaskMissing::forId($unavailableTaskIds[0]);
        }
    }
}
