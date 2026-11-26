<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\RunInOrderPipeline;
use App\Pipelines\Support\PipelineAdapter;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;

/**
 * Runs a subshell's steps in order; what they change in the shell context stays inside it.
 *
 * @extends PipelineAdapter<PendingStep, StepOutcome>
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

    protected function into(object $input): PendingStep
    {
        return $input;
    }

    protected function back(object $outcome, object $input): StepOutcome
    {
        return $outcome->withContext($input->context);
    }
}
