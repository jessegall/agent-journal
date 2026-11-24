<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Contracts\Bus\Pipable;
use App\Pipelines\RunBuiltinPipeline;
use App\Pipelines\RunExternalPartPipeline;
use App\Enums\StepType;
use App\Pipes\Supervision\AssignVariables;
use App\Values\ExecutionContext;
use App\Values\PlanStep;
use App\Values\PlanWord;

/**
 * One builtin or external part: its command substitutions run first, each output kept under its syntax node to stand
 * in the part's words, then the part itself.
 */
final readonly class PendingPart
{
    /**
     * @param  list<PlanStep>  $substitutions  the substitutions still to run
     * @param  array<int, string>  $substitutionOutputs  each substitution's output by its syntax node id
     */
    public function __construct(
        public PlanStep $step,
        public ExecutionContext $context,
        public RunState $state,
        public array $substitutions,
        public array $substitutionOutputs,
    ) {}

    public function hasSubstitution(): bool
    {
        return $this->substitutions !== [];
    }

    public function nextSubstitution(): PendingStep
    {
        return new PendingStep($this->substitutions[0], $this->context, $this->state);
    }

    public function withSubstitutionOutput(StepOutcome $outcome): self
    {
        return new self(
            $this->step,
            $this->context,
            $this->state,
            array_slice($this->substitutions, 1),
            [...$this->substitutionOutputs, $this->substitutions[0]->node => rtrim($outcome->output, "\n")],
        );
    }

    /**
     * The pipe that runs the part: a line of only assignments sets variables, a builtin runs in the shell context, any
     * other part is spawned.
     *
     * @return class-string<Pipable>
     */
    public function runner(): string
    {
        if ($this->step->argv === []) {
            return AssignVariables::class;
        }

        return $this->step->type === StepType::Builtin ? RunBuiltinPipeline::class : RunExternalPartPipeline::class;
    }

    /**
     * The part's words with each substitution's output in its place.
     *
     * @return list<string>
     */
    public function argv(): array
    {
        return array_map(fn (PlanWord $word) => $word->textWith($this->substitutionOutputs), $this->step->argv);
    }

    /**
     * The part's variable assignments with each substitution's output in its place.
     *
     * @return array<string, string>
     */
    public function assignments(): array
    {
        return array_map(fn (PlanWord $word) => $word->textWith($this->substitutionOutputs), $this->step->assignments);
    }
}
