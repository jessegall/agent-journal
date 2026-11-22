<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskWaits;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * Reads the waits between tasks for whoever may read them: a task's direct waits both ways, and which of some tasks
 * have every wait met.
 */
interface TaskWaitResolver
{
    /**
     * @throws TaskMissing
     */
    public function waitsOf(string $taskId): TaskWaits;

    /**
     * The given tasks that wait on any task, read in one query, so a list can offer their prerequisites.
     *
     * @param  list<string>  $taskIds
     * @return list<string>
     */
    public function withWaitsAmong(array $taskIds): array;

    /**
     * The given tasks whose every wait is met, in their given order; a task with no waits is ready.
     *
     * @param  list<string>  $taskIds
     * @return list<string>
     */
    public function readyAmong(array $taskIds): array;
}
