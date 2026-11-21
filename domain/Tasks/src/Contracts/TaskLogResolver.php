<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskLogPage;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * Reads a task's log for whoever may read the task, a bounded page at a time: the newest lines, the lines before a
 * sequence, or the lines after one.
 */
interface TaskLogResolver
{
    /**
     * @throws TaskMissing
     */
    public function newest(string $taskId, int $limit): TaskLogPage;

    /**
     * @throws TaskMissing
     */
    public function before(string $taskId, int $sequence, int $limit): TaskLogPage;

    /**
     * @throws TaskMissing
     */
    public function after(string $taskId, int $sequence, int $limit): TaskLogPage;
}
