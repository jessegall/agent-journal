<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use Carbon\CarbonImmutable;

/**
 * The old reads and lifecycle rows of a share were pruned, and counted on it.
 */
final readonly class SharePruned extends ShareEvent
{
    public function __construct(public string $shareId, public CarbonImmutable $at) {}
}
