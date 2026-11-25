<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Support\NumberedPage;
use Domain\Plans\Api\ListAssignedPlansPayload;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\AssignedPlanListData;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Values\AssignedPlanFilters;

/**
 * Answers the plans assigned to the caller.
 */
final readonly class ListAssignedPlansController
{
    public function __invoke(ListAssignedPlansPayload $call, PlanResolver $plans): AssignedPlanListData
    {
        $filters = new AssignedPlanFilters(
            search: (string) $call->search,
            states: array_map(PlanStatus::from(...), $call->states),
            page: new NumberedPage($call->page, $call->perPage),
        );

        return AssignedPlanListData::from($plans->assignedToCaller($filters));
    }
}
