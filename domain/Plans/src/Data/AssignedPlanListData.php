<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Values\AssignedPlanList;
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

    public static function fromList(AssignedPlanList $page): self
    {
        return self::from([
            'cards' => AssignedPlanCardData::collect($page->cards),
            'page' => $page->page->number,
            'perPage' => $page->page->size,
            'total' => $page->total,
        ]);
    }
}
