<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\ListItems;
use App\Processes\Grammar\ListRead;
use App\Processes\Grammar\Pipes\AttachListItem;
use App\Processes\Grammar\Pipes\CollectListItems;
use App\Processes\Grammar\Pipes\CompleteList;
use App\Processes\Grammar\Pipes\ParseListItem;
use App\Processes\Grammar\Pipes\SkipListSeparator;
use App\Processes\Grammar\UnparsedList;

/**
 * list := and_or ((; | & | newline) and_or)*, up to the closing token of a subshell or group, or the end.
 *
 * @implements PipelineDefinition<UnparsedList, ListRead>
 */
final readonly class ReadListPipeline implements PipelineDefinition
{
    public string $input = UnparsedList::class;

    public string $output = ListRead::class;

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
