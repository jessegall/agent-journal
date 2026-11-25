<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;

/**
 * The checks every review decision passes, in order: the plan's structure lock first, then the review the decider
 * read still the one asked for (a decided or withdrawn review reports its outcome). The plan could not change while
 * it was under review, so the decider read what it decides on.
 */
final readonly class PlanReviewDecision
{
    /**
     * @return array{0: Plan, 1: PlanReviewEdition}
     *
     * @throws PlanReviewRefused
     */
    public function certified(string $planId, int $editionNumber): array
    {
        $plan = Plan::lockStructure($planId);
        $edition = PlanReviewEdition::numberedIn($plan->id, $editionNumber);

        if ($edition === null) {
            throw PlanReviewRefused::notReviewing($plan->number, $plan->state->value);
        }

        if ($edition->state !== PlanReviewState::Requested) {
            throw PlanReviewRefused::alreadyDecided($plan->number, $edition->number, $edition->state->value);
        }

        return [
            $plan,
            $edition,
        ];
    }
}
