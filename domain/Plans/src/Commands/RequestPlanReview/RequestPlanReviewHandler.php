<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanReview;

use App\Support\ActorIdentity;
use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;

final readonly class RequestPlanReviewHandler extends PlanCommandHandler
{
    /**
     * The new review's id: under the plan's structure lock a planned plan gets its review row, then reads Reviewing.
     *
     * @throws PlanReviewRefused
     */
    public function handle(RequestPlanReviewCommand $command): string
    {
        $plan = Plan::lockStructure($command->planId);

        if ($plan->state !== PlanState::Planned) {
            throw PlanReviewRefused::notPlanned($plan->number, $plan->state->value);
        }

        $review = PlanReviewEdition::create($plan, ActorIdentity::of($command->dispatchedBy()));
        $plan->requestReview($review, $command->reviewers);

        return $review->id;
    }
}
