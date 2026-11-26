<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Assignments;

use App\Assignments\Contracts\AssignedWorkProvider as AssignedWorkProviderContract;
use App\Assignments\Contracts\AssignmentQuery;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Illuminate\Container\Attributes\Scoped;

/**
 * Counts the tasks an actor holds whose work is not over: open, started or blocked.
 */
#[Scoped]
final readonly class AssignedWorkProvider implements AssignedWorkProviderContract
{
    public function __construct(private AssignmentQuery $assignments) {}

    public function countFor(AssigneeIdentity $holder): int
    {
        return Task::query()
            ->unfinished()
            ->amongSelectedIds($this->assignments->heldIds(TaskType::linkType(), $holder))
            ->count();
    }
}
