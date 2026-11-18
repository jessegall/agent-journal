<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers\Support;

use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;

/**
 * The named reads of tasks the Tasks domain answers for.
 */
final readonly class TaskRecords
{
    public function get(int $taskId): Task
    {
        return Task::query()->find($taskId) ?? throw TaskMissing::forId($taskId);
    }
}
