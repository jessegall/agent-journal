<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\ActorWorkStacks;
use App\Contracts\Listener;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Support\States\Support\ReviewingPlanStateReference;

/**
 * Puts the review on each reviewer's stack in the same transaction as the request, so both commit or neither does; a
 * reviewer that works on no stack, such as a user, gets nothing pushed.
 */
#[InCommandTransaction]
final readonly class PushPlanReviewState implements Listener
{
    public function __construct(private ActorWorkStacks $workStack) {}

    public function handle(PlanReviewRequested $event): void
    {
        foreach ($event->reviewers as $reviewer) {
            $this->workStack->pushFor($reviewer, ReviewingPlanStateReference::forPlan($event->planId));
        }
    }
}
