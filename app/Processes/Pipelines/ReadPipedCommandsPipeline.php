<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\AddPipedCommandsNode;
use App\Processes\Pipes\Grammar\NoteNegation;
use App\Processes\Pipes\Grammar\ParseFirstPipedCommand;
use App\Processes\Pipes\Grammar\ParseNextPipedCommand;
use App\Processes\Pipes\Grammar\SkipPipeSymbol;
use App\Processes\Values\Grammar\PipedCommands;

/**
 * pipeline := [!] command ((| | |&) command)*.
 */
final readonly class ReadPipedCommandsPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            NoteNegation::class,
            ParseFirstPipedCommand::class,
            Step::repeated(
                [SkipPipeSymbol::class, ParseNextPipedCommand::class],
                while: fn (PipedCommands $commands) => $commands->isAtPipeSymbol()
            ),
            AddPipedCommandsNode::class,
        ];
    }
}
