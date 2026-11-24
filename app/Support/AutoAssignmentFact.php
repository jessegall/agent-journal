<?php

declare(strict_types=1);

namespace App\Support;

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
        public bool $isEnabled,
        public PoolReference $pool,
        public int $size,
        public int $revision,
        public CarbonImmutable|null $lastServedAt,
    ) {}

    /**
     * Its place before or after another in the order of turns: the one served longest ago, or never, goes first, and
     * the id breaks a tie.
     */
    public function compareTurn(self $other): int
    {
        return ($this->lastServedAt <=> $other->lastServedAt) ?: strcmp($this->id, $other->id);
    }
}
