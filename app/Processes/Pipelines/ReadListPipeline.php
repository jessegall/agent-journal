<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\FinishList;
use App\Processes\Pipes\Grammar\PlaceListItem;
use App\Processes\Pipes\Grammar\ReadListItem;
use App\Processes\Pipes\Grammar\StartList;
use App\Processes\Pipes\Grammar\StepPastListSeparator;
use App\Processes\Values\Grammar\ListItems;

/**
 * list := and_or ((; | & | newline) and_or)*, up to the closing token of a subshell or group, or the end.
 */
final readonly class ReadListPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            StartList::class,
            StepPastListSeparator::class,
            Step::repeated(
                [ReadListItem::class, PlaceListItem::class, StepPastListSeparator::class],
                while: fn (ListItems $items) => ! $items->reading->isAtItsEnd(),
            ),
            FinishList::class,
        ];
    }
}
