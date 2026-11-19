<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipelines\ReadCompoundPipeline;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\CompoundReading;
use App\Processes\Values\Grammar\NodeRead;

/**
 * ( list ) or { list }: read through the compound pipeline.
 *
 * @extends PipelineAdapter<CommandReading, NodeRead>
 */
final readonly class CompoundCommandReader extends PipelineAdapter implements CommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        return CompoundReading::opensAt($cursor);
    }

    protected function definition(): string
    {
        return ReadCompoundPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): CompoundReading
    {
        return $input->compound();
    }

    protected function back(object $result, object $input): NodeRead
    {
        return $result;
    }
}
