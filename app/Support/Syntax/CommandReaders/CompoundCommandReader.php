<?php

declare(strict_types=1);

namespace App\Support\Syntax\CommandReaders;

use App\Contracts\Bus\CommandReader;
use App\Pipelines\ReadCompoundPipeline;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\CompoundToParse;
use App\Support\Grammar\NodeRead;
use App\Support\PipelineAdapter;
use App\Support\Syntax\TokenCursor;

/**
 * ( list ) or { list }: read through the compound pipeline.
 *
 * @extends PipelineAdapter<CommandToParse, NodeRead>
 */
final readonly class CompoundCommandReader extends PipelineAdapter implements CommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        return CompoundToParse::opensAt($cursor);
    }

    protected function definition(): string
    {
        return ReadCompoundPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): CompoundToParse
    {
        return $input->compound();
    }

    protected function back(object $parsedCommand, object $input): NodeRead
    {
        return $parsedCommand;
    }
}
