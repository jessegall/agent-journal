<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadPipedCommandsPipeline;
use App\Processes\Values\Grammar\AndOrChain;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeReading;

/**
 * Reads the first pipeline of an and-or chain.
 *
 * @extends PipelineAdapter<NodeReading, NodeRead>
 */
final readonly class ReadFirstAndOrPart extends PipelineAdapter
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
        return $input;
    }

    protected function back(object $result, object $input): AndOrChain
    {
        return new AndOrChain($input, $result->node);
    }
}
