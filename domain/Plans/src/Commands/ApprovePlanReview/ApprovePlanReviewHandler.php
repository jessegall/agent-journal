<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\ApprovePlanReview;

use App\Support\ActorReference;
use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Support\PlanReviewDecision;

final readonly class ApprovePlanReviewHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewDecision $decision) {}

    /**
     * The approved edition's id, its decider, time and fingerprint being the receipt.
     *
     * @throws PlanReviewRefused
     */
    public function handle(ApprovePlanReviewCommand $command): string
    {
        [$plan, $edition] = $this->decision->certified($command->planId, $command->editionNumber);
        $edition->approve(ActorReference::of($command->dispatchedBy()), $command->requestKey);
        $plan->settleReview($edition->id, PlanReviewStatus::Approved);

        return $edition->id;
    }
}
