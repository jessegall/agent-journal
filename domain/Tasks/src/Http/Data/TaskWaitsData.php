<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Domain\Tasks\Api\TaskWaitLink;
use Domain\Tasks\Api\TaskWaits;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A task's direct waits as its reader shows them: the tasks it waits for and the tasks it holds up.
 */
#[TypeScript]
final class TaskWaitsData extends Data
{
    /**
     * @param  list<TaskWaitItemData>  $waitsFor
     * @param  list<TaskWaitItemData>  $holdsUp
     */
    public function __construct(
        #[DataCollectionOf(TaskWaitItemData::class)]
        public readonly array $waitsFor,
        #[DataCollectionOf(TaskWaitItemData::class)]
        public readonly array $holdsUp,
    ) {}

    public static function ofWaits(TaskWaits $waits): self
    {
        return new self(
            array_map(fn (TaskWaitLink $link) => TaskWaitItemData::ofLink($link), $waits->waitsFor),
            array_map(fn (TaskWaitLink $link) => TaskWaitItemData::ofLink($link), $waits->holdsUp),
        );
    }
}
