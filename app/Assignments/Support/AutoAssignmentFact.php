<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use Carbon\CarbonImmutable;

/**
 * One stored auto-assignment as read: whether it is on, its pool and size, its configuration revision, and when it
 * last gave the actor an item, if ever.
 */
final readonly class AutoAssignmentFact
{
    public function __construct(
        public string $id,
        public AutoAssignmentKey $key,
        public bool $enabled,
        public PoolReference $pool,
        public int $size,
        public int $revision,
        public CarbonImmutable|null $lastServedAt,
    ) {}
}
