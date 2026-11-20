<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Checks tasks for the actor of this request, all ids in one read. Every agent and the user read every task.
 */
#[Scoped]
final readonly class VisibleTasks implements TaskResolver
{
    public function __construct(private CurrentActor $actors) {}

    public function requireVisible(string $taskId): void
    {
        $this->requireAllVisible([$taskId]);
    }

    /**
     * @param  list<string>  $taskIds
     */
    public function requireAllVisible(array $taskIds): void
    {
        $this->actors->actor();
        $wanted = array_values(array_unique($taskIds));
        $found = array_values(array_map(
            strval(...),
            Task::query()->whereKey($wanted)->readLimit(count($wanted))->pluck('id')->all(),
        ));
        $this->assertAllFound($wanted, $found);
    }

    /**
     * @param  list<string>  $taskIds
     * @return list<TaskSummary>
     */
    public function summaries(array $taskIds): array
    {
        $this->actors->actor();
        $wanted = array_values(array_unique($taskIds));
        $tasks = Task::query()->whereKey($wanted)->readLimit(count($wanted))->get()->keyBy('id');
        $this->assertAllFound($wanted, array_values(array_map(strval(...), $tasks->keys()->all())));

        return array_map(fn (string $taskId) => $tasks[$taskId]->summary(), $taskIds);
    }

    /**
     * @param  list<string>  $wanted
     * @param  list<string>  $found
     */
    private function assertAllFound(array $wanted, array $found): void
    {
        $missing = array_values(array_diff($wanted, $found));
        if ($missing !== []) {
            throw TaskMissing::forId($missing[0]);
        }
    }
}
