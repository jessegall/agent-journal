<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Attributes\StateType;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Plans\Data\ReviewersOutData;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewingPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn, unless reviewers it sent are still out, whose reports wake it again. It keeps their ids with its frame.
 * It only nudges; the plan itself refuses changes while it is under review.
 */
#[StateType(ReviewingPlanStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class ReviewingPlanState extends AgentState
{
    private bool $isReviewing = true;

    private ReviewersOutData $reviewersOut;

    public function __construct(
        private readonly string $planId,
        private readonly int $number
    ) {
        $this->reviewersOut = new ReviewersOutData();
    }

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
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
        if ($event->planId === $this->planId) {
            $this->isReviewing = false;
        }
    }

    public function onPlanReviewWithdrawn(PlanReviewWithdrawn $event): void
    {
        if ($event->planId === $this->planId) {
            $this->isReviewing = false;
        }
    }

    public function onHelperSentOnRecord(HelperSentOnRecord $event): void
    {
        if ($this->isAbout($event->subject)) {
            $this->reviewersOut = $this->reviewersOut->adding($event->helperAgentId);
        }
    }

    public function onHelperReportedOnRecord(HelperReportedOnRecord $event): void
    {
        if ($this->isAbout($event->subject)) {
            $this->reviewersOut = $this->reviewersOut->removing($event->helperAgentId);
        }
    }

    // ----------[ Internals ]----------

    private function isAbout(RecordIdentity $subject): bool
    {
        return $subject->type === Plan::LINK_TYPE && $subject->id === $this->planId;
    }

    private function reviewText(): AgentText
    {
        return AgentText::of('plans.review', ['plan' => $this->number]);
    }
}
