<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Execution\RunState;
use App\Processes\Values\PlanStep;
use App\Values\ExecutionContext;

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
