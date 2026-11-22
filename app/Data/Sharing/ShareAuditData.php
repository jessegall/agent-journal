<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use App\Support\ShareAuditEntry;
use App\Support\ShareAuditPage;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page of the share's audit, the id the next page starts after, and what pruning kept of the rows it removed.
 */
#[TypeScript]
final class ShareAuditData extends Data
{
    /**
     * @param  list<ShareAuditEntryData>  $auditEntries
     */
    public function __construct(
        #[MapName('entries')]
        #[DataCollectionOf(ShareAuditEntryData::class)]
        public readonly array $auditEntries,
        public readonly string|null $nextAfter,
        public readonly int $prunedAllowedReads,
        public readonly int $prunedDeniedReads,
        public readonly int $prunedLifecycleRows,
        public readonly string|null $lastPrunedAt,
    ) {}

    public static function fromPage(ShareAuditPage $page): self
    {
        return new self(
            array_map(fn (ShareAuditEntry $entry) => ShareAuditEntryData::fromEntry($entry), $page->auditEntries),
            $page->nextAfter,
            $page->prunedAllowedReads,
            $page->prunedDeniedReads,
            $page->prunedLifecycleRows,
            $page->lastPrunedAt?->toIso8601String(),
        );
    }
}
