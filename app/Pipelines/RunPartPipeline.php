<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\RunNextSubstitution;
use App\Pipes\Supervision\StartPart;
use App\Support\Execution\PartToRun;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\Step;

/**
 * Runs one builtin or external part: its substitutions run first and supply their output as values, then it runs with
 * its own record.
 *
 * @implements PipelineDefinition<StepToRun, StepOutcome>
 */
final readonly class RunPartPipeline implements PipelineDefinition
{
    public string $input = StepToRun::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            StartPart::class,
            Step::repeated(RunNextSubstitution::class, while: fn (PartToRun $toRun) => $toRun->hasSubstitution()),
            Step::resolvedBy(fn (PartToRun $toRun) => $toRun->runner()),
        ];
    }
}
