<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Pipelines\Support\PipelineAdapter;
use App\Support\Execution\ActiveRun;
use App\Support\Execution\PendingStep;
use App\Support\Execution\RunEnded;
use App\Support\Execution\StepOutcome;

/**
 * Runs the plan's root step through the step pipeline.
 *
 * @extends PipelineAdapter<ActiveRun, StepOutcome>
 */
final readonly class RunRootStep extends PipelineAdapter
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
        return $input->rootStep();
    }

    protected function back(object $outcome, object $input): RunEnded
    {
        return $input->ended($outcome);
    }
}
