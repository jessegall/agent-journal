<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadAndOrPipeline;
use App\Support\Grammar\ListItem;
use App\Support\Grammar\ListItems;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedNode;
use App\Support\PipelineAdapter;

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
