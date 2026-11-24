<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\ConditionalSteps;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;
use App\Support\PipelineAdapter;

/**
 * Runs the first step of an && or || list, which always runs, and lines up the steps after it.
 *
 * @extends PipelineAdapter<PendingStep, StepOutcome>
 */
final readonly class RunFirstConditional extends PipelineAdapter
{
    protected function definition(): string
    {
        return ExecuteStepPipeline::class;
    }

    protected function produces(): string
    {
        return StepOutcome::class;
    }

    protected function into(object $input): PendingStep
    {
        return $input->firstChild();
    }

    protected function back(object $outcome, object $input): ConditionalSteps
    {
        return $input->conditionalAfter($outcome);
    }
}
