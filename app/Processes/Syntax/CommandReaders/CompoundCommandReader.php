<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipelines\ReadCompoundPipeline;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\CompoundToParse;
use App\Processes\Values\Grammar\NodeRead;

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
