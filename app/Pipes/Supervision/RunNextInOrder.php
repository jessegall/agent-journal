<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Pipelines\ExecuteStepPipeline;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepsInOrder;
use App\Support\Execution\PendingStep;
use App\Support\PipelineAdapter;

/**
 * Runs the next step of a sequence in the context the step before it left.
 *
 * @extends PipelineAdapter<StepsInOrder, StepOutcome>
 */
final readonly class RunNextInOrder extends PipelineAdapter
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
        return $input->next();
    }

    protected function back(object $outcome, object $input): StepsInOrder
    {
        return $input->after($outcome);
    }
}
