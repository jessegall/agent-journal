<?php

declare(strict_types=1);

namespace Domain\Tasks\Assignments;

use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Support\AssigneeIdentity;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Counts the tasks an actor holds whose work is not over: open, started or blocked.
 */
#[Scoped]
final readonly class ActiveTaskAssignments implements AssignedWorkProvider
{
    public function __construct(private AssignmentQuery $assignments) {}

    public function countFor(AssigneeIdentity $holder): int
    {
        return Task::query()
            ->unfinished()
            ->whereIn('id', $this->assignments->heldIds(TaskType::VALUE, $holder))
            ->count();
    }
}
