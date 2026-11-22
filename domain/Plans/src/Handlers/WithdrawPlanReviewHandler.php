<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Commands\WithdrawPlanReview;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;

final readonly class WithdrawPlanReviewHandler extends PlanCommandHandler
{
    /**
     * Records the withdrawal on the edition asked for and takes the plan back to Planned.
     *
     * @throws PlanReviewRefused
     */
    public function handle(WithdrawPlanReview $command): void
    {
        $plan = Plan::lockStructure($command->planId);
        $edition = PlanReviewEdition::requestedOf($plan->id);

        if ($plan->state !== PlanState::Reviewing || $edition === null) {
            throw PlanReviewRefused::notReviewing($plan->number, $plan->state->value);
        }

        $edition->withdraw(ActorIdentity::of($command->dispatchedBy()));
        $plan->withdrawReview($edition->id);
    }
}
