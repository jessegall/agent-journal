<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;

/**
 * The approval a plan's review gave: a change to the plan makes its current one historical.
 */
final readonly class PlanApprovals
{
    /**
     * Marks the plan's current approval historical, once the plan changed under it; a plan with none is left alone.
     */
    public function retireCurrentOf(Plan $plan): void
    {
        $approval = PlanReviewEdition::currentApprovalOf($plan->id);

        if ($approval === null) {
            return;
        }

        $approval->markHistorical();
    }
}
