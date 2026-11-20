<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSimpleCommandPipeline;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\OptionStatementToParse;

/**
 * Reads a shell option statement as a simple command, then marks it not supported.
 *
 * @extends PipelineAdapter<OptionStatementToParse, NodeRead>
 */
final readonly class ParseOptionStatement extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadSimpleCommandPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): CommandToParse
    {
        return $input->toParse;
    }

    protected function back(object $parsedStatement, object $input): NodeRead
    {
        $input->toParse->draft()->markStatementUnsupported($parsedStatement->node, $input->reason);

        return $parsedStatement;
    }
}
