<?php

declare(strict_types=1);

namespace App\Support;

/**
 * One page of records a provider read for a share: the cards of those it may disclose now, the bare identities of
 * those it may not, and where the next page starts, or null on the last. It never holds a body or a total.
 */
final readonly class ShareRecords
{
    /**
     * @param  list<ShareRecordCard>  $eligible
     * @param  list<RecordIdentity>  $ineligible
     */
    public function __construct(
        public array $eligible,
        public array $ineligible,
        public string|null $continuation,
    ) {}

    public function hasMore(): bool
    {
        return $this->continuation !== null;
    }
}
