<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Values\TaskHistoryPage;

/**
 * Reads a task's history for whoever may read the task: a bounded page, newest first, before a sequence or from the
 * newest.
 */
interface TaskHistoryResolver
{
    /**
     * @throws TaskMissing
     */
    public function historyOf(string $taskId, int|null $beforeSequence, int $limit): TaskHistoryPage;
}
