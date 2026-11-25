<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sessions\StartCandidateRank;

/**
 * One helper that may take the launch, with its rank, and whether any of its conversations, on any driver, was kept
 * under the purpose: an independent launch never takes a helper that was.
 */
final readonly class RankedStartCandidate
{
    public function __construct(
        public ActorIdentity $actor,
        public StartCandidateRank $rank,
        public bool $hasSeenThisPurpose,
    ) {}
}
