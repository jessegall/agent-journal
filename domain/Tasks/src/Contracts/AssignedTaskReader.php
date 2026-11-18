<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Actors\Exceptions\AgentActorRequired;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Api\TaskSummary;
use PhpOption\Option;

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

    /**
     * The task the calling agent is working on now: the highest unfinished task frame on its stack, covered or not.
     *
     * @return Option<TaskSummary> none when the stack holds no live task frame or is closed
     *
     * @throws AgentActorRequired
     */
    public function currentForCaller(): Option;
}
