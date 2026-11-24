<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\PipelineAdapter;

/**
 * Runs a child shell's script with its own positional parameters; what it changes in the context stays inside it.
 *
 * @extends PipelineAdapter<StepToRun, StepOutcome>
 */
final readonly class RunShell extends PipelineAdapter
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
        return $input->innerShell();
    }

    protected function back(object $outcome, object $input): StepOutcome
    {
        return $outcome->withContext($input->context);
    }
}
