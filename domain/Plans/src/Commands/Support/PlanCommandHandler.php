<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\Support;

use App\Contracts\CommandHandler;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Models\Plan;

/**
 * The base of every Plans handler, with the revision lock editing, cancelling and finishing a plan share.
 */
abstract readonly class PlanCommandHandler implements CommandHandler
{
    /**
     * The plan locked for a structural change, refused when it is no longer at the revision the caller read.
     *
     * @throws PlanRevisionChanged
     * @throws PlanUnderReview
     */
    final protected function lockPlanAtRevision(string $planId, int $expectedRevision): Plan
    {
        $plan = Plan::lockForChange($planId);

        if ($plan->revision !== $expectedRevision) {
            throw PlanRevisionChanged::for($plan->number, $expectedRevision, $plan->revision);
        }

        return $plan;
    }
}
