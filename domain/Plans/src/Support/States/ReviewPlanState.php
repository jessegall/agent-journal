<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Attributes\States\StateType;
use App\Contracts\Events\Event;
use App\Contracts\Work\DurableState;
use App\Contracts\Work\UniqueSubjectState;
use App\Events\Hooks\HelperAssigned;
use App\Events\Hooks\HelperFinishedOnRecord;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Plans\Data\ReviewersOutData;
use Domain\Plans\Events\PlanEvent;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn, unless reviewers it sent are still out, whose reports wake it again. It keeps their ids with its frame.
 * It only nudges; the plan itself refuses changes while it is under review.
 */
#[StateType(ReviewPlanStateReference::TYPE_KEY, schemaVersion: 1)]
final class ReviewPlanState extends AgentState implements DurableState, UniqueSubjectState
{
    private bool $isReviewing = true;

    private ReviewersOutData $reviewersOut;

    public function __construct(
        private readonly string $planId,
        private readonly int $number
    ) {
        $this->reviewersOut = new ReviewersOutData();
    }

    public function stateSubject(): string
    {
        return $this->planId;
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

    public function hears(Event $event): bool
    {
        return ! $event instanceof PlanEvent || $event->planId === $this->planId;
    }

    // ----------[ Hooks ]----------

    /**
     * While a reviewer it sent is out, the stop passes on to the states below; with none out the review holds it.
     */
    public function onStop(StopRequested $input): Decision
    {
        if ($this->reviewersOut->agentIds !== []) {
            return Decision::delegate();
        }

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

    public function onHelperAssigned(HelperAssigned $event): void
    {
        if ($this->isAbout($event->subject)) {
            $this->reviewersOut = $this->reviewersOut->adding($event->helperAgentId);
        }
    }

    public function onHelperFinishedOnRecord(HelperFinishedOnRecord $event): void
    {
        if ($this->isAbout($event->subject)) {
            $this->reviewersOut = $this->reviewersOut->removing($event->helperAgentId);
        }
    }

    // ----------[ Internals ]----------

    private function isAbout(RecordIdentity $subject): bool
    {
        return $subject->type === Plan::linkType() && $subject->id === $this->planId;
    }

    private function reviewText(): AgentText
    {
        return AgentText::of('plans.review', ['plan' => $this->number]);
    }
}
