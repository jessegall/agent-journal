<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers\Support;

use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;

/**
 * The named reads of tasks the Tasks domain answers for.
 */
final readonly class TaskFinder
{
    public function get(string $taskId): Task
    {
        return Task::query()->findOr($taskId, TaskMissing::throwing()->forId($taskId));
    }

    /**
     * The tasks of these ids that exist, by id, in one read.
     *
     * @param  list<string>  $ids
     * @return array<string, Task>
     */
    public function many(array $ids): array
    {
        return Task::query()->whereKey($ids)->get()->keyBy('id')->all();
    }
}
