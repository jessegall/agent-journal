<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Domain\Tasks\Api\TaskList;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page of the tasks the calling agent holds, with the page asked for and the total from the same snapshot.
 *
 * @method static static from(TaskList|array<string, mixed> $payload)
 */
final class AssignedTaskListData extends Data
{
    /**
     * @param  list<AssignedTaskCardData>  $cards
     */
    public function __construct(
        #[DataCollectionOf(AssignedTaskCardData::class)]
        public readonly array $cards,
        public readonly int $page,
        public readonly int $perPage,
        public readonly int $total,
    ) {}

    public static function fromList(TaskList $page): self
    {
        return self::from([
            'cards' => AssignedTaskCardData::collect($page->cards),
            'page' => $page->page->number,
            'perPage' => $page->page->size,
            'total' => $page->total,
        ]);
    }
}
