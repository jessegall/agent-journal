<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\PipedCommands;
use App\Processes\Grammar\Pipelines\ReadCommandPipeline;
use App\Processes\Grammar\UnparsedCommand;
use App\Processes\Grammar\UnparsedPipedCommands;

/**
 * Reads the first command of a shell pipeline through the command pipeline.
 *
 * @extends PipelineAdapter<UnparsedPipedCommands, NodeRead>
 */
final readonly class ParseFirstPipedCommand extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadCommandPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): UnparsedCommand
    {
        return $input->toParse->command();
    }

    protected function back(object $parsedCommand, object $input): PipedCommands
    {
        return $input->withFirst($parsedCommand->node);
    }
}
