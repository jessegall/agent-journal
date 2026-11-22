<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Support\States\AgentState;
use Closure;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;
use Domain\Plans\Values\PlanProgress;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on a plan. It answers no hook itself; it marks which plan the agent works on until the plan is done
 * or cancelled, so the agent's current plan is read from its stack.
 */
final class WorkingOnPlanState extends AgentState
{
    /**
     * @param  Closure(): PlanProgress  $progress  reads the plan's counts now, only when its instruction is rendered
     */
    public function __construct(public readonly PlanWork $plan, private readonly Closure $progress) {}

    public function isFinished(): bool
    {
        return $this->plan->state->hasEnded();
    }

    /**
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return new Some(Plan::LINK_TYPE);
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        $progress = ($this->progress)();

        return new Some(
            "Continue plan {$this->plan->number}. {$progress->finished} of {$progress->total} tasks are finished.",
        );
    }
}
