<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Support\NumberedPage;
use Domain\Plans\Calls\ListAssignedPlansCall;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\AssignedPlanListData;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Values\AssignedPlanFilters;

/**
 * Answers the plans assigned to the caller.
 */
final readonly class ListAssignedPlansController
{
    public function __invoke(ListAssignedPlansCall $call, PlanResolver $plans): AssignedPlanListData
    {
        $filters = new AssignedPlanFilters(
            search: (string) $call->search,
            states: array_map(PlanState::from(...), $call->states),
            page: new NumberedPage($call->page, $call->perPage),
        );

        return AssignedPlanListData::from($plans->assignedToCaller($filters));
    }
}
