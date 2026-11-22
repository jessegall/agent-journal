<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\AttachListItem;
use App\Pipes\Grammar\CollectListItems;
use App\Pipes\Grammar\CompleteList;
use App\Pipes\Grammar\ParseListItem;
use App\Pipes\Grammar\SkipListSeparator;
use App\Support\Grammar\ListItems;
use App\Support\Step;

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
            Step::repeated(
                [ParseListItem::class, AttachListItem::class, SkipListSeparator::class],
                while: fn (ListItems $listCursor) => ! $listCursor->toParse->isAtItsEnd()
            ),
            CompleteList::class,
        ];
    }
}
