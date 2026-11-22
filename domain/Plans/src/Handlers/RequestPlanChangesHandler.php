<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Commands\RequestPlanChanges;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Handlers\Support\PlanReviewDecision;

final readonly class RequestPlanChangesHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewDecision $decision) {}

    /**
     * The edition's id, sent back with the reason as the plan's visible changes-requested note.
     *
     * @throws PlanReviewRefused
     */
    public function handle(RequestPlanChanges $command): string
    {
        [$plan, $edition] = $this->decision->certified($command->planId, $command->editionNumber);
        $edition->requestChanges(ActorIdentity::of($command->dispatchedBy()), $command->requestKey, $command->reason);
        $plan->settleReview($edition->id, PlanReviewState::ChangesRequested);

        return $edition->id;
    }
}
