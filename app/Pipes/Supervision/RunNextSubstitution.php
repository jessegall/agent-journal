<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\RunInOrderPipeline;
use App\Support\Execution\PendingPart;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\PendingStep;
use App\Support\PipelineAdapter;

/**
 * Runs a part's next command substitution and keeps its standard output as the value its words use.
 *
 * @extends PipelineAdapter<PendingPart, StepOutcome>
 */
final readonly class RunNextSubstitution extends PipelineAdapter
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
        return $input->nextSubstitution();
    }

    protected function back(object $outcome, object $input): PendingPart
    {
        return $input->withSubstitutionOutput($outcome);
    }
}
