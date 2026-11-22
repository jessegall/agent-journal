<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Plans\Commands\RequestPlanReview;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanReviewFreezer;

final readonly class RequestPlanReviewHandler extends PlanCommandHandler
{
    public function __construct(private PlanReviewFreezer $freezer) {}

    /**
     * The new edition's id: under the plan's structure lock a planned plan's content is frozen, then the plan reads
     * Reviewing.
     *
     * @throws PlanReviewRefused
     */
    public function handle(RequestPlanReview $command): string
    {
        $plan = Plan::lockStructure($command->planId);

        if ($plan->state !== PlanState::Planned) {
            throw PlanReviewRefused::notPlanned($plan->number, $plan->state->value);
        }

        $edition = $this->freezer->freeze($plan, ActorIdentity::of($command->dispatchedBy()));
        $plan->requestReview($edition->id);

        return $edition->id;
    }
}
