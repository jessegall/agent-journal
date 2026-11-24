<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\RunInOrderPipeline;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\PipelineAdapter;

/**
 * Runs a subshell's steps in order; what they change in the shell context stays inside it.
 *
 * @extends PipelineAdapter<StepToRun, StepOutcome>
 */
final readonly class RunSubshell extends PipelineAdapter
{
    protected function definition(): string
    {
        return RunInOrderPipeline::class;
    }

    protected function produces(): string
    {
        return StepOutcome::class;
    }

    protected function into(object $input): StepToRun
    {
        return $input;
    }

    protected function back(object $outcome, object $input): StepOutcome
    {
        return $outcome->withContext($input->context);
    }
}
