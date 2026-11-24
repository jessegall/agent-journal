<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\RunEnded;
use App\Support\Execution\RunUnderway;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\PipelineAdapter;

/**
 * Runs the plan's root step through the step pipeline.
 *
 * @extends PipelineAdapter<RunUnderway, StepOutcome>
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

    protected function into(object $input): StepToRun
    {
        return $input->rootStep();
    }

    protected function back(object $outcome, object $input): RunEnded
    {
        return $input->ended($outcome);
    }
}
