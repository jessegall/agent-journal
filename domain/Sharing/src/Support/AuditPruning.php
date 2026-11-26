<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

/**
 * What one PruneShareAudit run did: how many audit rows past their retention it removed, and whether more wait.
 */
final readonly class AuditPruning
{
    public function __construct(
        public int $pruned,
        public bool $hasMore,
    ) {}
}
