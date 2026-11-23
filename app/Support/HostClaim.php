<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\ProjectReadClaims;

/**
 * What one host poll took: the driver requests it claimed and the reads of its projects it was handed.
 */
final readonly class HostClaim
{
    public function __construct(
        public ClaimedRequests $requests,
        public ProjectReadClaims $projectReads,
    ) {}

    public function isEmpty(): bool
    {
        return $this->requests->isEmpty() && $this->projectReads->isEmpty();
    }
}
