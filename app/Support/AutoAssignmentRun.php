<?php

declare(strict_types=1);

namespace App\Support;

/**
 * What one pass of filling auto-assignments did: how many facts it considered, how many claims it started, how many
 * of them gave an item and how many failed, and the fact id the next pass starts after, or null to start over.
 */
final readonly class AutoAssignmentRun
{
    public function __construct(
        public int $considered,
        public int $claimsStarted,
        public int $assigned,
        public int $failed,
        public string|null $nextAfterId,
    ) {}
}
