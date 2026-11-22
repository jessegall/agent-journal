<?php

declare(strict_types=1);

namespace Domain\Plans\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Support\PlanWork;

/**
 * An agent asked to review a plan: its instruction is the review, and it may not stop until the review is decided or
 * withdrawn. It only nudges; the plan itself refuses changes while it is under review.
 */
final class ReviewingPlanState extends AgentState implements InstructsForeground
{
    public function __construct(public readonly PlanWork $plan) {}

    public function isFinished(): bool
    {
        return $this->plan->state !== PlanState::Reviewing;
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->instructionText());
    }

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new ReleaseInstruction());
    }

    public function instructionType(): string
    {
        return 'plans.review';
    }

    public function instructionText(): string
    {
        return "Plan {$this->plan->number} waits for your review. Read it, then approve it or ask for changes.";
    }
}
