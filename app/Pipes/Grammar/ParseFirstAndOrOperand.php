<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadPipedCommandsPipeline;
use App\Support\Grammar\AndOrChain;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\NodeToParse;
use App\Support\PipelineAdapter;

/**
 * Reads the first pipeline of an and-or chain.
 *
 * @extends PipelineAdapter<NodeToParse, NodeRead>
 */
final readonly class ParseFirstAndOrOperand extends PipelineAdapter
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
        return $input;
    }

    protected function back(object $parsedPipeline, object $input): AndOrChain
    {
        return new AndOrChain($input, $parsedPipeline->node);
    }
}
