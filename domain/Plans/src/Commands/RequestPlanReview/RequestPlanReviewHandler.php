<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanReview;

use Domain\Plans\Commands\Support\PlanCommandHandler;
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
        $plan = Plan::findLockedStructure($command->planId);

        $review = PlanReviewEdition::create($plan, $command->dispatchedBy());
        $plan->openReview($review, $command->reviewers);

        return $review->id;
    }
}
