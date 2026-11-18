<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Support\Pipelines;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipelines\ReadCompoundPipeline;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Stages\Grammar\CompoundReading;
use App\Processes\Stages\Grammar\NodeRead;
use App\Processes\Syntax\TokenCursor;

/**
 * ( list ) or { list }: read through the compound pipeline.
 */
final readonly class CompoundCommandReader implements CommandReader
{
    public function __construct(private Pipelines $pipelines) {}

    public function reads(TokenCursor $cursor): bool
    {
        return CompoundReading::opensAt($cursor);
    }

    public function read(CommandReading $reading): int
    {
        $compound = $reading->compound();

        return $this->pipelines->run(ReadCompoundPipeline::class, $compound, NodeRead::class)->node;
    }
}
