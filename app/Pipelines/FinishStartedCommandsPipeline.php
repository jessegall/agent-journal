<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipes\Supervision\FinishPipedCommands;
use App\Pipes\Supervision\PumpPipedCommands;
use App\Support\Execution\PipedCommands;
use App\Support\Execution\StepOutcome;

/**
 * Pumps the output of a pipeline whose commands all started, then ends each of them.
 *
 * @implements PipelineDefinition<PipedCommands, StepOutcome>
 */
final readonly class FinishStartedCommandsPipeline implements PipelineDefinition
{
    public string $input = PipedCommands::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            PumpPipedCommands::class,
            FinishPipedCommands::class,
        ];
    }
}
