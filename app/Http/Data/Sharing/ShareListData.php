<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's list of shares and proposals, newest first: one page of rows, the filters it was read with, and the id
 * the next page starts after when there is one.
 */
#[TypeScript]
final class ShareListData extends Data
{
    /**
     * @param  list<ShareRowData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(ShareRowData::class)]
        public readonly array $rows,
        public readonly ShareFiltersData $filters,
        public readonly string|null $nextAfter,
    ) {}
}
