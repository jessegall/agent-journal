<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\WithdrawPlanReview;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;

final readonly class WithdrawPlanReviewHandler extends PlanCommandHandler
{
    /**
     * Records the withdrawal on the edition asked for and takes the plan back to Planned.
     *
     * @throws PlanReviewRefused
     */
    public function handle(WithdrawPlanReviewCommand $command): void
    {
        $plan = Plan::findLockedStructure($command->planId);
        $edition = PlanReviewEdition::findRequestedOf($plan->id);

        if ($plan->status !== PlanStatus::Reviewing || $edition === null) {
            throw PlanReviewRefused::notReviewing($plan->number, $plan->status->value);
        }

        $edition->withdraw($command->dispatchedBy());
        $plan->withdrawReview($edition->id);
    }
}
