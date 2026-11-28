<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;
use Illuminate\Database\Eloquent\Collection;

/**
 * One numbered page of the tasks whoever acts may see, by search and states, each with its holder and its run.
 */
interface TaskListResolver
{
    /**
     * The tasks that match the filters.
     */
    public function list(TaskFilters $filters): TaskList;

    /** @return Collection<int, Task> */
    public function preview(TaskFilters $filters, int $limit): Collection;
}
