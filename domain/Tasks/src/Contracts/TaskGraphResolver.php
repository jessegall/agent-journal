<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * The graph of some tasks and the waits among them, for the caller: every task must be one they may read.
 */
interface TaskGraphResolver
{
    /**
     * @param  list<string>  $taskIds  the tasks of the plan
     * @param  string  $selectedId  the task chosen now, or an empty string
     * @param  string  $returnAddress  where a task's own page leads back to, restoring the selected node
     *
     * @throws TaskMissing
     */
    public function graphOf(string $planId, array $taskIds, string $selectedId, string $returnAddress): TaskGraph;
}
