<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\PipedCommands;
use App\Processes\Grammar\Pipelines\ReadCommandPipeline;
use App\Processes\Grammar\UnparsedCommand;

/**
 * Reads the command after a | or |& through the command pipeline.
 *
 * @extends PipelineAdapter<PipedCommands, NodeRead>
 */
final readonly class ParseNextPipedCommand extends PipelineAdapter
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
        return $input->command();
    }

    protected function back(object $parsedCommand, object $input): PipedCommands
    {
        return $input->with($parsedCommand->node);
    }
}
