<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\LaunchCandidateRank;

/**
 * One helper that may take the launch, with its rank, and whether any of its conversations, on any driver, was kept
 * under the purpose: an independent launch never takes a helper that was.
 */
final readonly class RankedLaunchCandidate
{
    public function __construct(
        public ActorIdentity $actor,
        public LaunchCandidateRank $rank,
        public bool $hasSeenThisPurpose,
    ) {}
}
