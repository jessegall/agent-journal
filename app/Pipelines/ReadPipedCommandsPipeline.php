<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\AddPipedCommandsNode;
use App\Pipes\Grammar\NoteNegation;
use App\Pipes\Grammar\ParseFirstPipedCommand;
use App\Pipes\Grammar\ParseNextPipedCommand;
use App\Pipes\Grammar\SkipPipeSymbol;
use App\Support\Grammar\PipedCommands;
use App\Support\Step;

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
