<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Values\PlanStep;

/**
 * The steps of an && or || list after the first, still to run or skip: a && b runs b only when a succeeded, a || b
 * only when it failed.
 */
final readonly class ConditionalSteps
{
    /**
     * @param  list<PlanStep>  $remaining
     */
    public function __construct(
        public array $remaining,
        public StepOutcome $outcome,
        public bool $runsOnSuccess,
        public RunState $state,
    ) {}

    public function hasNext(): bool
    {
        return $this->remaining !== [];
    }

    public function nextRuns(): bool
    {
        return $this->outcome->status->isSuccess() === $this->runsOnSuccess;
    }

    public function next(): PendingStep
    {
        return new PendingStep($this->remaining[0], $this->outcome->context, $this->state);
    }

    public function after(StepOutcome $next): self
    {
        return new self(array_slice($this->remaining, 1), $this->outcome->then($next), $this->runsOnSuccess, $this->state);
    }

    public function skippingNext(): self
    {
        return new self(array_slice($this->remaining, 1), $this->outcome, $this->runsOnSuccess, $this->state);
    }

    /**
     * Why the next step does not run, as its skipped record says.
     */
    public function skipReason(): string
    {
        $operator = $this->runsOnSuccess ? '&&' : '||';

        return "the step before {$operator} ended with status {$this->outcome->status->code}";
    }
}
