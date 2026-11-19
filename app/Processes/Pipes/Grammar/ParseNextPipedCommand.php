<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadCommandPipeline;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\PipedCommands;

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

    protected function into(object $input): CommandReading
    {
        return $input->command();
    }

    protected function back(object $result, object $input): PipedCommands
    {
        return $input->with($result->node);
    }
}
