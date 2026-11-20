<?php

declare(strict_types=1);

namespace Domain\Rules\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The rules slice: the rows, the accepted filters even when nothing matched, the pagination, and the selected rule or
 * the fact that it does not exist.
 */
#[TypeScript]
final class RuleListData extends Data
{
    /**
     * @param  list<RuleRowData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(RuleRowData::class)]
        public readonly array $rows,
        public readonly RuleFiltersData $filters,
        public readonly RulePaginationData $pagination,
        public readonly bool $selectionMissing,
        public readonly RuleReaderData|Optional $selected = new Optional(),
    ) {}
}
