<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadPipedCommandsPipeline;
use App\Processes\Values\Grammar\AndOrChain;
use App\Processes\Values\Grammar\AndOrLink;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeReading;

/**
 * Reads the pipeline after an && or || and joins it to the chain from the left.
 *
 * @extends PipelineAdapter<AndOrLink, NodeRead>
 */
final readonly class ReadLinkedAndOrPart extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadPipedCommandsPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): NodeReading
    {
        return $input->chain->reading;
    }

    protected function back(object $result, object $input): AndOrChain
    {
        return $input->joinedWith($result->node);
    }
}
