<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Models\Sharing\Share;
use Carbon\CarbonImmutable;

/**
 * One page of a share's audit, newest first, the id the next page starts after, and the totals pruning kept of the
 * rows it removed.
 */
final readonly class ShareAuditPage
{
    /**
     * @param  list<ShareAuditEntry>  $auditEntries
     */
    public function __construct(
        public array $auditEntries,
        public string|null $nextAfter,
        public int $prunedAllowedReads,
        public int $prunedDeniedReads,
        public int $prunedLifecycleRows,
        public CarbonImmutable|null $lastPrunedAt,
    ) {}

    /**
     * The page of the share's entries, with the pruning totals the share keeps.
     *
     * @param  list<ShareAuditEntry>  $entries
     */
    public static function of(Share $share, array $entries, string|null $nextAfter): self
    {
        return new self(
            $entries,
            $nextAfter,
            $share->pruned_allowed_reads,
            $share->pruned_denied_reads,
            $share->pruned_lifecycle_rows,
            $share->last_pruned_at,
        );
    }
}
