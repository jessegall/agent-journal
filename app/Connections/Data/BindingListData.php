<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of the connected folders, every row read at one server time: that time, when the page must be read again
 * because a shown presence expires, none when none does, and the cursor of the next page, none on the last.
 */
#[TypeScript]
final class BindingListData extends Data
{
    /**
     * @param  list<ProjectBindingRowData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(ProjectBindingRowData::class)]
        public readonly array $rows,
        public readonly string $serverTime,
        public readonly string|null $refreshAt,
        public readonly string|null $nextCursor,
    ) {}
}
