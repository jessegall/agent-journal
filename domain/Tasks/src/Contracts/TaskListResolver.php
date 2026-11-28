<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Support\Layout\LayoutRowData;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;

/**
 * One numbered page of the tasks whoever acts may see, by search and states, each with its holder and its run.
 */
interface TaskListResolver
{
    /**
     * The tasks that match the filters.
     */
    public function list(TaskFilters $filters): TaskList;

    /**
     * The rows shown in the window for these filters.
     *
     * @return list<LayoutRowData>
     */
    public function preview(TaskFilters $filters, int $limit): array;
}
