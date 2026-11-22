<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\PlanReviewEdition;

final readonly class EditPlanHandler extends PlanCommandHandler
{
    /**
     * Gives the plan its new text as a new revision; an approval of the earlier content stays recorded but becomes
     * historical.
     *
     * @throws PlanRevisionChanged
     */
    public function handle(EditPlan $command): int
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        $plan->describe(
            $command->title ?? $plan->title,
            $command->brief ?? $plan->brief,
            $command->type ?? $plan->type,
        );

        PlanReviewEdition::currentApprovalOf($plan->id)?->markHistorical();

        return $plan->revision;
    }
}
