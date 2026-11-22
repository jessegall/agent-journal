<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Commands\ApprovePlanReview;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Support\PlanReviewDecision;

final readonly class ApprovePlanReviewHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewDecision $decision) {}

    /**
     * The approved edition's id, its decider, time and fingerprint being the receipt.
     *
     * @throws PlanReviewRefused
     */
    public function handle(ApprovePlanReview $command): string
    {
        [$plan, $edition] = $this->decision->certified($command->planId, $command->editionNumber);
        $edition->approve(ActorIdentity::of($command->dispatchedBy()), $command->requestKey);
        $plan->settleReview($edition->id, PlanReviewState::Approved);

        return $edition->id;
    }
}
