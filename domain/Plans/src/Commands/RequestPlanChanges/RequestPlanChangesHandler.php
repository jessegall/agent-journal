<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanChanges;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Support\PlanReviewDecision;

final readonly class RequestPlanChangesHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewDecision $decision) {}

    /**
     * The edition's id, sent back with the reason as the plan's visible changes-requested note.
     *
     * @throws PlanReviewRefused
     */
    public function handle(RequestPlanChangesCommand $command): string
    {
        [$plan, $edition] = $this->decision->certified($command->planId, $command->editionNumber);
        $edition->requestChanges(ActorIdentity::of($command->dispatchedBy()), $command->requestKey, $command->reason);
        $plan->settleReview($edition->id, PlanReviewState::ChangesRequested);

        return $edition->id;
    }
}
