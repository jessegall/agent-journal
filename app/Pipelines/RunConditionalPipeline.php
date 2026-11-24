<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\EndConditional;
use App\Pipes\Supervision\RunFirstConditional;
use App\Pipes\Supervision\RunNextConditional;
use App\Pipes\Supervision\SkipNextConditional;
use App\Support\Execution\ConditionalSteps;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;
use App\Support\Step;

/**
 * Runs an && or || list: a && b runs b only when a succeeded, a || b only when it failed; a step that does not run is
 * recorded as skipped.
 *
 * @implements PipelineDefinition<PendingStep, StepOutcome>
 */
final readonly class RunConditionalPipeline implements PipelineDefinition
{
    public string $input = PendingStep::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            RunFirstConditional::class,
            Step::repeated(
                Step::chosen(
                    fn (ConditionalSteps $steps) => $steps->doesNextStepRun(),
                    RunNextConditional::class,
                    SkipNextConditional::class,
                ),
                while: fn (ConditionalSteps $steps) => $steps->hasNext(),
            ),
            EndConditional::class,
        ];
    }
}
