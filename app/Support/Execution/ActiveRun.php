<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Values\ExecutionContext;
use App\Values\PlanStep;

/**
 * A supervised run before its root step ran: the root step, the context it starts in and the run's state.
 */
final readonly class ActiveRun
{
    public function __construct(public PlanStep $root, public ExecutionContext $context, public RunState $state) {}

    public function rootStep(): PendingStep
    {
        return new PendingStep($this->root, $this->context, $this->state);
    }

    public function ended(StepOutcome $outcome): RunEnded
    {
        return new RunEnded($outcome, $this->state);
    }
}
