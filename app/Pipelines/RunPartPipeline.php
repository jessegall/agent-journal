<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Pipes\Supervision\RunNextSubstitution;
use App\Pipes\Supervision\StartPart;
use App\Support\Execution\PendingPart;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;

/**
 * Runs one builtin or external part: its substitutions run first and supply their output as values, then it runs with
 * its own record.
 *
 * @implements PipelineDefinition<PendingStep, StepOutcome>
 */
final readonly class RunPartPipeline implements PipelineDefinition
{
    public string $input = PendingStep::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            StartPart::class,
            Step::repeated(RunNextSubstitution::class, while: fn (PendingPart $toRun) => $toRun->hasSubstitution()),
            Step::resolvedBy(fn (PendingPart $toRun) => $toRun->runner()),
        ];
    }
}
