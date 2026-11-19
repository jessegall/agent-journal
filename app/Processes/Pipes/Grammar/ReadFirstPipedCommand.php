<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadCommandPipeline;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\PipedCommands;
use App\Processes\Values\Grammar\PipedCommandsReading;

/**
 * Reads the first command of a shell pipeline through the command pipeline.
 *
 * @extends PipelineAdapter<PipedCommandsReading, NodeRead>
 */
final readonly class ReadFirstPipedCommand extends PipelineAdapter
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
        return $input->reading->command();
    }

    protected function back(object $result, object $input): PipedCommands
    {
        return $input->withFirst($result->node);
    }
}
