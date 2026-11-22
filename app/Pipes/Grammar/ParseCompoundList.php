<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadListPipeline;
use App\Support\Grammar\CompoundParts;
use App\Support\Grammar\ListRead;
use App\Support\Grammar\ListToParse;
use App\Support\PipelineAdapter;

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

    protected function into(object $input): ListToParse
    {
        return $input->toParse->list($input->node);
    }

    protected function back(object $parsedList, object $input): CompoundParts
    {
        return $input;
    }
}
