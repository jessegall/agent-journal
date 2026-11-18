<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use Carbon\CarbonImmutable;

/**
 * One page of a share's audit, newest first, the id the next page starts after, and the totals pruning kept of the
 * rows it removed.
 */
final readonly class ShareAuditPage
{
    /**
     * @param  list<ShareAuditEntry>  $entries
     */
    public function __construct(
        public array $entries,
        public string|null $nextAfter,
        public int $prunedAllowedReads,
        public int $prunedDeniedReads,
        public int $prunedLifecycleRows,
        public CarbonImmutable|null $lastPrunedAt,
    ) {}
}
