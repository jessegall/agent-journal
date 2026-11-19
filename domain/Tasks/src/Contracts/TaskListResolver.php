<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;

/**
 * One numbered page of the tasks whoever acts may see, by search and states, each with its holder and its run.
 */
interface TaskListResolver
{
    public function list(TaskFilters $filters): TaskList;
}
