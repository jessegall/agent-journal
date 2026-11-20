<?php

declare(strict_types=1);

namespace Domain\Plans\States;

use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\States\AgentState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;

/**
 * An agent working on a plan. It answers no hook itself; it marks which plan the agent works on until the plan is done
 * or cancelled, so the agent's current plan is read from its stack.
 */
final class WorkingOnPlanState extends AgentState implements WorkRecordState
{
    public function __construct(private readonly PlanState $plan) {}

    public function isFinished(): bool
    {
        return $this->plan->hasEnded();
    }

    public function workRecordType(): string
    {
        return Plan::LINK_TYPE;
    }
}
