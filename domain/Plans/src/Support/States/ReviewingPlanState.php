<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Contracts\Work\OwnValuesState;
use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use App\Support\States\AgentState;
use Domain\Plans\Data\ReviewersOutData;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn, unless reviewers it sent are still out, whose reports wake it again. It keeps their ids with its frame.
 * It only nudges; the plan itself refuses changes while it is under review.
 */
final class ReviewingPlanState extends AgentState implements OwnValuesState
{
    private ReviewersOutData $reviewersOut;

    public function __construct(public readonly PlanWork $plan)
    {
        $this->reviewersOut = new ReviewersOutData();
    }

    public function isFinished(): bool
    {
        return $this->plan->state !== PlanState::Reviewing;
    }

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

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->reviewText());
    }

    public function ownValues(): ReviewersOutData
    {
        return $this->reviewersOut;
    }

    public function restoreOwnValues(array $stored): void
    {
        $this->reviewersOut = ReviewersOutData::from($stored);
    }

    private function isAbout(RecordIdentity $subject): bool
    {
        return $subject->type === Plan::LINK_TYPE && $subject->id === $this->plan->planId;
    }

    private function reviewText(): string
    {
        return "Plan {$this->plan->number} waits for your review. Read it, then approve it or ask for changes.";
    }
}
