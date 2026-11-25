<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;

/**
 * Puts the review on each reviewer's stack in the same transaction as the request, so both commit or neither does; a
 * reviewer that works on no stack, such as a user, gets nothing pushed.
 */
#[InCommandTransaction]
final readonly class PushPlanReviewState implements Listener
{
    public function __construct(private AgentStack $stacks) {}

    public function handle(PlanReviewRequested $event): void
    {
        $reference = ReviewPlanStateReference::forPlan($event->planId, $event->planNumber);

        foreach ($event->reviewers as $reviewer) {
            $this->stacks->pushFor($reviewer, $reference);
        }
    }
}
