<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareState;

/**
 * What the owner's list of shares is narrowed to: a state, a root record type, a gateway configuration, a deadline
 * before which they expire, and the id the next page starts after, newest first.
 */
final readonly class ShareListFilters
{
    public function __construct(
        public ShareState|null $state,
        public string|null $rootType,
        public string|null $configurationId,
        public CarbonImmutable|null $expiresBefore,
        public string|null $after,
    ) {}
}
