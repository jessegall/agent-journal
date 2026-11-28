<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Exceptions\CrossProjectEdge;
use App\Projects\Contracts\ProjectOwned;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Values\TaskSummary;

/**
 * Checks that tasks named by id exist and may be read by whoever acts in this request. It changes nothing; a check
 * that passed says so for that moment only.
 */
interface TaskVisibility
{
    /**
     * @throws TaskMissing
     */
    public function requireVisible(string $taskId): void;

    /**
     * Every id must be there, or the whole check fails; it never passes for some of them.
     *
     * @param  list<string>  $taskIds
     *
     * @throws TaskMissing
     */
    public function requireAllVisible(array $taskIds): void;

    /**
     * Every id must be there and each task of the project of the record it joins, or the whole check fails.
     *
     * @param  list<string>  $taskIds
     *
     * @throws TaskMissing
     * @throws CrossProjectEdge
     */
    public function requireAllVisibleBeside(array $taskIds, ProjectOwned $joined): void;

    /**
     * The number and title of each task, in the order of the ids.
     *
     * @param  list<string>  $taskIds
     * @return list<TaskSummary>
     *
     * @throws TaskMissing
     */
    public function summaries(array $taskIds): array;
}
