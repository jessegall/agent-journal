<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\AttachListItem;
use App\Processes\Pipes\Grammar\CollectListItems;
use App\Processes\Pipes\Grammar\CompleteList;
use App\Processes\Pipes\Grammar\ParseListItem;
use App\Processes\Pipes\Grammar\SkipListSeparator;
use App\Processes\Values\Grammar\ListItems;

/**
 * list := and_or ((; | & | newline) and_or)*, up to the closing token of a subshell or group, or the end.
 */
final readonly class ReadListPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            CollectListItems::class,
            SkipListSeparator::class,
            Step::repeated([ParseListItem::class, AttachListItem::class, SkipListSeparator::class],
                while: fn (ListItems $items) => ! $items->reading->isAtItsEnd()
            ),
            CompleteList::class,
        ];
    }
}
