<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Execution\RunState;
use App\Processes\Values\PlanStep;

/**
 * The steps of a sequence still to run, each in the context the one before it left, and the outcome so far.
 */
final readonly class StepsInOrder
{
    /**
     * @param  list<PlanStep>  $remaining
     */
    public function __construct(public array $remaining, public StepOutcome $outcome, public RunState $state) {}

    public function hasNext(): bool
    {
        return $this->remaining !== [];
    }

    public function next(): PendingStep
    {
        return new PendingStep($this->remaining[0], $this->outcome->context, $this->state);
    }

    public function after(StepOutcome $next): self
    {
        return new self(array_slice($this->remaining, 1), $this->outcome->then($next), $this->state);
    }
}
