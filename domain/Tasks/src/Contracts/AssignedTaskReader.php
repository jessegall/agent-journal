<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Actors\Exceptions\AgentActorRequired;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;

/**
 * The tasks the calling agent holds directly, terminal ones included, read in one snapshot. Running, creating or
 * holding the task's plan does not count.
 */
interface AssignedTaskReader
{
    /**
     * @throws AgentActorRequired
     */
    public function assignedToCaller(TaskFilters $filters): TaskList;
}
