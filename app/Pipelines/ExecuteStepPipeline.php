<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\PendingStep;
use App\Support\Step;

/**
 * Runs one step of a plan by the pipe or pipeline for its kind; the pipelines of steps that hold steps run each of them
 * through this pipeline again.
 *
 * @implements PipelineDefinition<PendingStep, StepOutcome>
 */
final readonly class ExecuteStepPipeline implements PipelineDefinition
{
    public string $input = PendingStep::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            Step::resolvedBy(fn (PendingStep $toRun) => $toRun->runner()),
        ];
    }
}
