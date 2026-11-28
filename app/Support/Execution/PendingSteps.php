<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Execution\RunState;
use App\Processes\Values\PlanStep;

/**
 * The steps of an && or || list after the first, still to run or skip: a && b runs b only when a succeeded, a || b
 * only when it failed.
 */
final readonly class PendingSteps
{
    /**
     * @param  list<PlanStep>  $remaining
     */
    private function __construct(
        private array $remaining,
        public StepOutcome $outcome,
        private RunState $state,
        private bool|null $runsOnSuccess,
    ) {}

    /** @param list<PlanStep> $remaining */
    public static function inOrder(array $remaining, StepOutcome $outcome, RunState $state): self
    {
        return new self($remaining, $outcome, $state, null);
    }

    /** @param list<PlanStep> $remaining */
    public static function conditional(array $remaining, StepOutcome $outcome, RunState $state, bool $runsOnSuccess): self
    {
        return new self($remaining, $outcome, $state, $runsOnSuccess);
    }

    public function hasNext(): bool
    {
        return $this->remaining !== [];
    }

    public function doesNextStepRun(): bool
    {
        return $this->runsOnSuccess === null || $this->outcome->status->isSuccess() === $this->runsOnSuccess;
    }

    public function next(): PendingStep
    {
        return new PendingStep($this->remaining[0], $this->outcome->context, $this->state);
    }

    public function after(StepOutcome $next): self
    {
        return clone ($this, [
            'remaining' => array_slice($this->remaining, 1),
            'outcome' => $this->outcome->then($next),
        ]);
    }

    public function skippingNext(): self
    {
        return clone ($this, ['remaining' => array_slice($this->remaining, 1)]);
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
