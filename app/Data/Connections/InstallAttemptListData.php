<?php

declare(strict_types=1);

namespace App\Data\Connections;

use App\Values\InstallAttemptPage;
use App\Values\InstallAttemptRow;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of the owner's install attempts and the cursor of the next, none on the last.
 */
#[TypeScript]
final class InstallAttemptListData extends Data
{
    /**
     * @param  list<InstallAttemptRowData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(InstallAttemptRowData::class)]
        public readonly array $rows,
        public readonly string|null $nextCursor,
    ) {}

    public static function fromPage(InstallAttemptPage $page): self
    {
        return self::from([
            'rows' => array_map(fn (InstallAttemptRow $row) => InstallAttemptRowData::fromRow($row), $page->rows),
            'nextCursor' => $page->nextCursor,
        ]);
    }
}
