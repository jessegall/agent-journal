<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\QueuePipedCommands;
use App\Pipes\Supervision\NotifyPipedCommandsRefused;
use App\Pipes\Supervision\SpawnPart;
use App\Support\Execution\PipedCommands;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepToRun;
use App\Support\Step;

/**
 * Runs a shell pipeline: its commands queued and started in turn, their output pumped from one into the next, and
 * each ended; one that does not start ends the pipeline as not found.
 *
 * @implements PipelineDefinition<StepToRun, StepOutcome>
 */
final readonly class RunPipedCommandsPipeline implements PipelineDefinition
{
    public string $input = StepToRun::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            QueuePipedCommands::class,
            Step::repeated(SpawnPart::class, while: fn (PipedCommands $commands) => $commands->hasWaiting()),
            Step::chosen(
                fn (PipedCommands $commands) => $commands->isRefused,
                NotifyPipedCommandsRefused::class,
                FinishStartedCommandsPipeline::class,
            ),
        ];
    }
}
