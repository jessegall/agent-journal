<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadPipedCommandsPipeline;
use App\Support\Grammar\AndOrChain;
use App\Support\Grammar\AndOrLink;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\NodeToParse;
use App\Support\PipelineAdapter;

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

    protected function into(object $input): NodeToParse
    {
        return $input->chain->toParse;
    }

    protected function back(object $parsedPipeline, object $input): AndOrChain
    {
        return $input->joinedWith($parsedPipeline->node);
    }
}
