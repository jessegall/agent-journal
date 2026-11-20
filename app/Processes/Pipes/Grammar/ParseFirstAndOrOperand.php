<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadPipedCommandsPipeline;
use App\Processes\Values\Grammar\AndOrChain;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeToParse;

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
