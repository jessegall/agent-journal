<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadSimpleCommandPipeline;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedOptionStatement;
use App\Support\PipelineAdapter;

/**
 * Reads a shell option statement as a simple command, then marks it not supported.
 *
 * @extends PipelineAdapter<UnparsedOptionStatement, NodeRead>
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

    protected function into(object $input): UnparsedCommand
    {
        return $input->toParse;
    }

    protected function back(object $parsedStatement, object $input): NodeRead
    {
        $input->toParse->draft()->markStatementUnsupported($parsedStatement->node, $input->reason);

        return $parsedStatement;
    }
}
