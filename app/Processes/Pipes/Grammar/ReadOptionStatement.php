<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSimpleCommandPipeline;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\OptionStatementReading;

/**
 * Reads a shell option statement as a simple command, then marks it not supported.
 *
 * @extends PipelineAdapter<OptionStatementReading, NodeRead>
 */
final readonly class ReadOptionStatement extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadSimpleCommandPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): CommandReading
    {
        return $input->reading;
    }

    protected function back(object $result, object $input): NodeRead
    {
        $input->reading->draft()->markStatementUnsupported($result->node, $input->reason);

        return $result;
    }
}
