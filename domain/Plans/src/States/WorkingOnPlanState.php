<?php

declare(strict_types=1);

namespace Domain\Plans\States;

use App\Hooks\States\AgentState;
use Domain\Plans\Enums\PlanState;

/**
 * An agent working on a plan. It answers no hook itself; it marks which plan the agent works on until the plan is done
 * or cancelled, so the agent's current plan is read from its stack.
 */
final class WorkingOnPlanState extends AgentState
{
    public function __construct(private readonly PlanState $plan) {}

    public function isFinished(): bool
    {
        return $this->plan->hasEnded();
    }
}
