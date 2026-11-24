<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\ConditionalSteps;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\PipelineAdapter;

/**
 * Runs the next step of an && or || list whose step before it decided that it runs.
 *
 * @extends PipelineAdapter<ConditionalSteps, StepOutcome>
 */
final readonly class RunNextConditional extends PipelineAdapter
{
    protected function definition(): string
    {
        return ExecuteStepPipeline::class;
    }

    protected function produces(): string
    {
        return StepOutcome::class;
    }

    protected function into(object $input): StepToRun
    {
        return $input->next();
    }

    protected function back(object $outcome, object $input): ConditionalSteps
    {
        return $input->after($outcome);
    }
}
