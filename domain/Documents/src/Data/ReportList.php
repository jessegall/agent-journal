<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a list, and whether a next page follows.
 */
#[TypeScript]
final class ReportList extends Data
{
    /**
     * @param  list<ReportCard>  $rows
     */
    public function __construct(
        #[DataCollectionOf(ReportCard::class)]
        public readonly array $rows,
        public readonly int $page,
        public readonly bool $hasNextPage,
    ) {}
}
