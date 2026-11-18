<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Actors\Contracts\CurrentActor;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Checks tasks for the actor of this request, all ids in one read. Every agent and the user read every task.
 */
#[Scoped]
final readonly class VisibleTasks implements TaskReader
{
    public function __construct(private CurrentActor $actors) {}

    public function requireVisible(int $taskId): void
    {
        $this->requireAllVisible([$taskId]);
    }

    /**
     * @param  list<int>  $taskIds
     */
    public function requireAllVisible(array $taskIds): void
    {
        $this->actors->actor();
        $wanted = array_values(array_unique($taskIds));
        $found = array_map(intval(...), Task::query()->whereKey($wanted)->pluck('id')->all());
        $missing = array_values(array_diff($wanted, $found));

        if ($missing !== []) {
            throw TaskMissing::forId($missing[0]);
        }
    }
}
