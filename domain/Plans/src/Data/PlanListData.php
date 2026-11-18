<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The plans slice a page shows: the cards, the accepted filters even when nothing matched, the pagination, and the
 * selected plan or the fact that the selection cannot be read (with no title).
 */
#[TypeScript]
final class PlanListData extends Data
{
    /**
     * @param  list<PlanCardData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(PlanCardData::class)] public readonly array $rows,
        public readonly PlanFiltersData $filters,
        public readonly PlanPaginationData $pagination,
        public readonly bool $selectionMissing,
        public readonly PlanReaderData|Optional $selected = new Optional(),
    ) {}
}
