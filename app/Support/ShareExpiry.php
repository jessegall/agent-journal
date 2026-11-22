<?php

declare(strict_types=1);

namespace App\Support;

/**
 * What one ExpireShares run did: how many shares it expired, and whether more past their deadline wait for the next.
 */
final readonly class ShareExpiry
{
    public function __construct(
        public int $expired,
        public bool $hasMore,
    ) {}
}
