<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadCommandPipeline;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\PipedCommands;
use App\Support\PipelineAdapter;

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
