<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Bus\Contracts\CommandReader;
use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipelines\ReadCompoundPipeline;
use App\Processes\Grammar\UnparsedCommand;
use App\Processes\Grammar\UnparsedCompound;
use App\Support\Syntax\TokenCursor;

/**
 * ( list ) or { list }: read through the compound pipeline.
 *
 * @extends PipelineAdapter<UnparsedCommand, NodeRead>
 */
final readonly class CompoundCommandReader extends PipelineAdapter implements CommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        return UnparsedCompound::opensAt($cursor);
    }

    protected function definition(): string
    {
        return ReadCompoundPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): UnparsedCompound
    {
        return $input->compound();
    }

    protected function back(object $parsedCommand, object $input): NodeRead
    {
        return $parsedCommand;
    }
}
