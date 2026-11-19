<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\JoinPipedCommands;
use App\Processes\Pipes\Grammar\ReadFirstPipedCommand;
use App\Processes\Pipes\Grammar\ReadNegation;
use App\Processes\Pipes\Grammar\ReadNextPipedCommand;
use App\Processes\Pipes\Grammar\StepPastPipeSymbol;
use App\Processes\Values\Grammar\PipedCommands;

/**
 * pipeline := [!] command ((| | |&) command)*.
 */
final readonly class ReadPipedCommandsPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadNegation::class,
            ReadFirstPipedCommand::class,
            Step::repeated([StepPastPipeSymbol::class, ReadNextPipedCommand::class],
                while: fn (PipedCommands $commands) => $commands->isAtPipeSymbol()
            ),
            JoinPipedCommands::class,
        ];
    }
}
