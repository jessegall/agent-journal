<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers\Support;

use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Support\PlanReviewCertifier;

/**
 * The checks every review decision passes, in order: the plan's structure lock first, the edition the decider read
 * still the one asked for (a decided or withdrawn edition reports its outcome), then the certification of the whole
 * content under the members' shared locks.
 */
final readonly class PlanReviewDecision
{
    public function __construct(private PlanReviewCertifier $certifier) {}

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

        $this->certifier->assertCurrent($plan, $edition);

        return [$plan, $edition];
    }
}
