<?php

declare(strict_types=1);

namespace App\Support\Syntax\CommandReaders;

use App\Contracts\Bus\CommandReader;
use App\Pipelines\ReadCompoundPipeline;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\UnparsedCompound;
use App\Support\PipelineAdapter;
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
