<?php

declare(strict_types=1);

namespace App\Events\Reviews;

/**
 * A review decision was linked to the ask that merges it.
 */
final readonly class ReviewDecisionMergeLinked extends ReviewEvent
{
    public function __construct(
        public string $decisionId,
        public string $mergeAskId,
    ) {}
}
