<?php

declare(strict_types=1);

namespace Domain\Plans\Contracts;

use App\Actors\Exceptions\AgentActorRequired;
use Domain\Plans\Api\AssignedPlanFilters;
use Domain\Plans\Api\AssignedPlanList;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanList;

/**
 * One page of plan cards for whoever acts in this request, with the selected plan; every agent and the user read every
 * plan, but a read needs someone acting.
 */
interface PlanReader
{
    public function list(PlanFilters $filters): PlanList;

    /**
     * The plans the calling agent holds directly, read in one snapshot; holding a phase or a task of a plan does not
     * count.
     *
     * @throws AgentActorRequired
     */
    public function assignedToCaller(AssignedPlanFilters $filters): AssignedPlanList;
}
