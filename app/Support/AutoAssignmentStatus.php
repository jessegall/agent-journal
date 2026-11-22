<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\AutoAssignmentState;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

/**
 * An auto-assignment as its reader sees it now: whether it is configured on and where it stands, its pool and size
 * once they can be read, the held count and room only for a reader allowed to see totals, its configuration revision
 * and when it last gave the actor an item, which says nothing about health.
 */
final readonly class AutoAssignmentStatus
{
    /**
     * @param  Option<PoolDescription>  $pool
     * @param  Option<int>  $size
     * @param  Option<AssignmentTotals>  $totals
     * @param  Option<CarbonImmutable>  $lastAssignedAt
     */
    public function __construct(
        public bool $enabled,
        public AutoAssignmentState $state,
        public int $revision,
        public Option $pool,
        public Option $size,
        public Option $totals,
        public Option $lastAssignedAt,
    ) {}

    /**
     * An auto-assignment that was never enabled: off, at revision 0.
     */
    public static function never(): self
    {
        return new self(
            false,
            AutoAssignmentState::Off,
            0,
            None::create(),
            None::create(),
            None::create(),
            None::create(),
        );
    }

    /**
     * A stored auto-assignment whose configuration cannot be read; nothing of it stands in for a default.
     */
    public static function unreadable(bool $enabled, int $revision): self
    {
        return new self(
            $enabled,
            AutoAssignmentState::Invalid,
            $revision,
            None::create(),
            None::create(),
            None::create(),
            None::create(),
        );
    }
}
