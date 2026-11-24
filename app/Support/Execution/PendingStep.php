<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Pipelines\RunInBackgroundPipeline;
use App\Pipelines\RunPipedCommandsPipeline;
use App\Contracts\Bus\Pipable;
use App\Enums\ExitStatus;
use App\Enums\StepType;
use App\Pipelines\RunConditionalPipeline;
use App\Pipelines\RunInOrderPipeline;
use App\Pipelines\RunPartPipeline;
use App\Pipes\Supervision\NegateStep;
use App\Pipes\Supervision\RefuseStep;
use App\Pipes\Supervision\RunShell;
use App\Pipes\Supervision\RunSubshell;
use App\Pipes\Supervision\SkipStoppedStep;
use App\Values\ExecutionContext;
use App\Values\PlanStep;

/**
 * One step of a plan about to run, in the shell context it runs in, with the run's state.
 */
final readonly class PendingStep
{
    public function __construct(public PlanStep $step, public ExecutionContext $context, public RunState $state) {}

    /**
     * The pipe or pipeline that runs this kind of step; every step of a stopped run is skipped.
     *
     * @return class-string<Pipable>
     */
    public function runner(): string
    {
        if ($this->state->stop->isRequested()) {
            return SkipStoppedStep::class;
        }

        return match ($this->step->type) {
            StepType::Sequence, StepType::Group => RunInOrderPipeline::class,
            StepType::AndList, StepType::OrList => RunConditionalPipeline::class,
            StepType::Negation => NegateStep::class,
            StepType::Subshell => RunSubshell::class,
            StepType::Shell => RunShell::class,
            StepType::Pipeline => RunPipedCommandsPipeline::class,
            StepType::Background => RunInBackgroundPipeline::class,
            StepType::Builtin, StepType::Command => RunPartPipeline::class,
            StepType::Substitution => RefuseStep::class,
        };
    }

    public function firstChild(): self
    {
        return new self($this->step->children[0], $this->context, $this->state);
    }

    /**
     * The shell's inner step, run with the shell's positional parameters.
     */
    public function innerShell(): self
    {
        return new self($this->step->innerShell(), $this->context->withPositional($this->step->positional), $this->state);
    }

    public function inOrder(): StepsInOrder
    {
        return new StepsInOrder(
            $this->step->children,
            new StepOutcome(ExitStatus::Success->status(), $this->context),
            $this->state,
        );
    }

    /**
     * The steps after the first of an && or || list, with the first's outcome to decide on.
     */
    public function conditionalAfter(StepOutcome $first): ConditionalSteps
    {
        return new ConditionalSteps(
            array_slice($this->step->children, 1),
            $first,
            $this->step->type === StepType::AndList,
            $this->state,
        );
    }

    public function part(): PendingPart
    {
        return new PendingPart($this->step, $this->context, $this->state, $this->step->children, []);
    }
}
