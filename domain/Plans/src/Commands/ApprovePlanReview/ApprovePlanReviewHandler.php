<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\ApprovePlanReview;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Support\PlanReviewChecks;

final readonly class ApprovePlanReviewHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewChecks $decision) {}

    /**
     * The approved edition's id, its decider, time and fingerprint being the receipt.
     *
     * @throws PlanReviewRefused
     */
    public function handle(ApprovePlanReviewCommand $command): string
    {
        [$plan, $edition] = $this->decision->certified($command->planId, $command->editionNumber);
        $edition->approve($command->dispatchedBy(), $command->requestKey);
        $plan->settleReview($edition->id, PlanReviewStatus::Approved);

        return $edition->getKey();
    }
}
