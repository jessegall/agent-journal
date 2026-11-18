<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Sharing\Support\ShareAuditEntry;
use App\Sharing\Support\ShareAuditPage;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page of the share's audit, the id the next page starts after, and what pruning kept of the rows it removed.
 */
#[TypeScript]
final class ShareAuditData extends Data
{
    /**
     * @param  list<ShareAuditEntryData>  $entries
     */
    public function __construct(
        #[DataCollectionOf(ShareAuditEntryData::class)]
        public readonly array $entries,
        public readonly string|null $nextAfter,
        public readonly int $prunedAllowedReads,
        public readonly int $prunedDeniedReads,
        public readonly int $prunedLifecycleRows,
        public readonly string|null $lastPrunedAt,
    ) {}

    public static function fromPage(ShareAuditPage $page): self
    {
        return new self(
            array_map(fn (ShareAuditEntry $entry) => ShareAuditEntryData::fromEntry($entry), $page->entries),
            $page->nextAfter,
            $page->prunedAllowedReads,
            $page->prunedDeniedReads,
            $page->prunedLifecycleRows,
            $page->lastPrunedAt?->toIso8601String(),
        );
    }
}
