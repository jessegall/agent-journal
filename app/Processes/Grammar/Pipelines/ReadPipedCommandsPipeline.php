<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\PipedCommands;
use App\Processes\Grammar\Pipes\AddPipedCommandsNode;
use App\Processes\Grammar\Pipes\NoteNegation;
use App\Processes\Grammar\Pipes\ParseFirstPipedCommand;
use App\Processes\Grammar\Pipes\ParseNextPipedCommand;
use App\Processes\Grammar\Pipes\SkipPipeSymbol;
use App\Processes\Grammar\UnparsedNode;

/**
 * pipeline := [!] command ((| | |&) command)*.
 *
 * @implements PipelineDefinition<UnparsedNode, NodeRead>
 */
final readonly class ReadPipedCommandsPipeline implements PipelineDefinition
{
    public string $input = UnparsedNode::class;

    public string $output = NodeRead::class;

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
