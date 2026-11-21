<?php

declare(strict_types=1);

namespace Domain\Plans\States;

use App\Hooks\Commands\FocusPlan;
use App\Hooks\Commands\ReleasePlanFocus;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use Closure;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;

/**
 * An agent working on a plan. It answers no hook itself; it marks which plan the agent works on until the plan is done
 * or cancelled, so the agent's current plan is read from its stack.
 */
final class WorkingOnPlanState extends AgentState implements InstructsForeground, WorkRecordState
{
    /**
     * @param  Closure(): PlanProgress  $progress  reads the plan's counts now, only when its instruction is rendered
     */
    public function __construct(public readonly PlanWork $plan, private readonly Closure $progress) {}

    public function isFinished(): bool
    {
        return $this->plan->state->hasEnded();
    }

    public function workRecordType(): string
    {
        return Plan::LINK_TYPE;
    }

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusPlan());
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusPlan());
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new ReleasePlanFocus());
    }

    public function instructionType(): string
    {
        return 'plans.plan';
    }

    public function instructionText(): string
    {
        $progress = ($this->progress)();

        return "Continue plan {$this->plan->number}. {$progress->done} of {$progress->total} tasks are finished.";
    }
}
