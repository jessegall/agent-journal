<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\EndInOrder;
use App\Pipes\Supervision\RunNextInOrder;
use App\Pipes\Supervision\StartInOrder;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepsInOrder;
use App\Support\Execution\PendingStep;
use App\Support\Step;

/**
 * Runs a step's children one after another, each in the context the one before it left.
 *
 * @implements PipelineDefinition<PendingStep, StepOutcome>
 */
final readonly class RunInOrderPipeline implements PipelineDefinition
{
    public string $input = PendingStep::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            StartInOrder::class,
            Step::repeated(RunNextInOrder::class, while: fn (StepsInOrder $steps) => $steps->hasNext()),
            EndInOrder::class,
        ];
    }
}
