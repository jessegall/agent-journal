<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\PendingStep;
use App\Support\PipelineAdapter;

/**
 * Runs the negated step and reports its outcome as ! does: only the branch decision flips, never the part's stored end.
 *
 * @extends PipelineAdapter<PendingStep, StepOutcome>
 */
final readonly class NegateStep extends PipelineAdapter
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

    protected function back(object $outcome, object $input): StepOutcome
    {
        return $outcome->negated();
    }
}
