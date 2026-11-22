<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadCommandPipeline;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\PipedCommands;
use App\Support\Grammar\PipedCommandsToParse;
use App\Support\PipelineAdapter;

/**
 * Reads the first command of a shell pipeline through the command pipeline.
 *
 * @extends PipelineAdapter<PipedCommandsToParse, NodeRead>
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

    protected function into(object $input): CommandToParse
    {
        return $input->toParse->command();
    }

    protected function back(object $parsedCommand, object $input): PipedCommands
    {
        return $input->withFirst($parsedCommand->node);
    }
}
