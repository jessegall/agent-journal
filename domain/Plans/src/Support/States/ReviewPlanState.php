<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Contracts\Work\UniqueSubjectState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use App\Values\AgentText;
use Domain\Plans\Events\PlanEvent;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn. It only nudges; the plan itself refuses changes while it is under review.
 */
#[StateType(ReviewPlanStateReference::class, version: 1)]
final class ReviewPlanState extends AgentState implements DurableState, UniqueSubjectState
{
    private bool $isReviewing = true;

    public function __construct(
        private readonly string $planId,
        private readonly int $number
    ) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), $this->planId);
    }

    public function isFinished(): bool
    {
        return ! $this->isReviewing;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->reviewText());
    }

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof PlanEvent || $event->planId === $this->planId;
    }

    // ----------[ Hooks ]----------

    /**
     * The review holds every stop until it is decided or withdrawn.
     */
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->reviewText());
    }

    // ----------[ Events ]----------

    public function onPlanReviewDecided(PlanReviewDecided $event): void
    {
        $this->isReviewing = false;
    }

    public function onPlanReviewWithdrawn(PlanReviewWithdrawn $event): void
    {
        $this->isReviewing = false;
    }

    // ----------[ Internals ]----------

    private function reviewText(): AgentText
    {
        return AgentText::of('plans.review', ['plan' => $this->number]);
    }
}
