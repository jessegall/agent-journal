<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\ListItem;
use App\Processes\Grammar\ListItems;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipelines\ReadAndOrPipeline;
use App\Processes\Grammar\UnparsedNode;

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

    protected function into(object $input): UnparsedNode
    {
        return $input->toParse->andOr();
    }

    protected function back(object $parsedCommand, object $input): ListItem
    {
        return new ListItem($input->toParse, $parsedCommand->node);
    }
}
