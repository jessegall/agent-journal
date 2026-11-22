<?php

declare(strict_types=1);

namespace Domain\Plans\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Support\PlanWork;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn. It only nudges; the plan itself refuses changes while it is under review.
 */
final class ReviewingPlanState extends AgentState
{
    public function __construct(public readonly PlanWork $plan) {}

    public function isFinished(): bool
    {
        return $this->plan->state !== PlanState::Reviewing;
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->reviewText());
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->reviewText());
    }

    private function reviewText(): string
    {
        return "Plan {$this->plan->number} waits for your review. Read it, then approve it or ask for changes.";
    }
}
