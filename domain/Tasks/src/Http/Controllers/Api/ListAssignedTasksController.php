<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Api;

use App\Support\NumberedPage;
use Domain\Tasks\Api\ListAssignedTasksPayload;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Data\AssignedTaskListData;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskFilters;

/**
 * Answers the tasks assigned to the caller.
 */
final readonly class ListAssignedTasksController
{
    public function __invoke(ListAssignedTasksPayload $call, AssignedTaskResolver $tasks): AssignedTaskListData
    {
        $filters = new TaskFilters(
            search: $call->search,
            states: array_map(TaskStatus::from(...), $call->states),
            page: new NumberedPage($call->page, $call->perPage),
        );

        return AssignedTaskListData::from($tasks->assignedToCaller($filters));
    }
}
