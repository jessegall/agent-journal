<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadListPipeline;
use App\Processes\Values\Grammar\CompoundParts;
use App\Processes\Values\Grammar\ListRead;
use App\Processes\Values\Grammar\ListReading;

/**
 * Reads the list inside a subshell or group through the list pipeline again.
 *
 * @extends PipelineAdapter<CompoundParts, ListRead>
 */
final readonly class ReadCompoundList extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadListPipeline::class;
    }

    protected function produces(): string
    {
        return ListRead::class;
    }

    protected function into(object $input): ListReading
    {
        return $input->reading->list($input->node);
    }

    protected function back(object $result, object $input): CompoundParts
    {
        return $input;
    }
}
