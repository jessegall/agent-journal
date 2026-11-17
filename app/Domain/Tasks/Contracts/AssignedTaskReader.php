<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Contracts;

use App\Core\Actors\Exceptions\AgentActorRequired;
use App\Domain\Tasks\Api\TaskFilters;
use App\Domain\Tasks\Api\TaskList;

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
