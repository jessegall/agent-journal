<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadAndOrPipeline;
use App\Processes\Values\Grammar\ListItem;
use App\Processes\Values\Grammar\ListItems;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeReading;

/**
 * Reads the next item of a list through the and-or pipeline.
 *
 * @extends PipelineAdapter<ListItems, NodeRead>
 */
final readonly class ParseListItem extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadAndOrPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): NodeReading
    {
        return $input->reading->andOr();
    }

    protected function back(object $result, object $input): ListItem
    {
        return new ListItem($input->reading, $result->node);
    }
}
