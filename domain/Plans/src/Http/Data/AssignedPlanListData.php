<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Data;

use Domain\Plans\Api\AssignedPlanList;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page of the plans the calling agent holds, with the page asked for and the total from the same snapshot.
 *
 * @method static static from(AssignedPlanList|array<string, mixed> $payload)
 */
final class AssignedPlanListData extends Data
{
    /**
     * @param  list<AssignedPlanCardData>  $cards
     */
    public function __construct(
        #[DataCollectionOf(AssignedPlanCardData::class)]
        public readonly array $cards,
        public readonly int $page,
        public readonly int $perPage,
        public readonly int $total,
    ) {}

    public static function fromList(AssignedPlanList $list): self
    {
        return self::from([
            'cards' => AssignedPlanCardData::collect($list->cards),
            'page' => $list->page->number,
            'perPage' => $list->page->size,
            'total' => $list->total,
        ]);
    }
}
