<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\CompoundParts;
use App\Processes\Grammar\ListRead;
use App\Processes\Grammar\Pipelines\ReadListPipeline;
use App\Processes\Grammar\UnparsedList;

/**
 * Reads the list inside a subshell or group through the list pipeline again.
 *
 * @extends PipelineAdapter<CompoundParts, ListRead>
 */
final readonly class ParseCompoundList extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadListPipeline::class;
    }

    protected function produces(): string
    {
        return ListRead::class;
    }

    protected function into(object $input): UnparsedList
    {
        return $input->toParse->list($input->node);
    }

    protected function back(object $parsedList, object $input): CompoundParts
    {
        return $input;
    }
}
