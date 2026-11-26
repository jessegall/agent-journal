<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\AndOrChain;
use App\Processes\Grammar\AndOrLink;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipelines\ReadPipedCommandsPipeline;
use App\Processes\Grammar\UnparsedNode;

/**
 * Reads the pipeline after an && or || and joins it to the chain from the left.
 *
 * @extends PipelineAdapter<AndOrLink, NodeRead>
 */
final readonly class ParseNextAndOrOperand extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadPipedCommandsPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): UnparsedNode
    {
        return $input->chain->toParse;
    }

    protected function back(object $parsedPipeline, object $input): AndOrChain
    {
        return $input->joinedWith($parsedPipeline->node);
    }
}
