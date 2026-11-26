<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\AndOrChain;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipelines\ReadPipedCommandsPipeline;
use App\Processes\Grammar\UnparsedNode;

/**
 * Reads the first pipeline of an and-or chain.
 *
 * @extends PipelineAdapter<UnparsedNode, NodeRead>
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

    protected function into(object $input): UnparsedNode
    {
        return $input;
    }

    protected function back(object $parsedPipeline, object $input): AndOrChain
    {
        return new AndOrChain($input, $parsedPipeline->node);
    }
}
