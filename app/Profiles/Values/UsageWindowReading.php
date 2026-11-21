<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\UsageWindowSlot;
use Carbon\CarbonImmutable;

/**
 * One observed reading of a limit window: the provider's limit, the window, how much of it is used in percent, how
 * long it lasts and when it resets, each only when the program reported it.
 */
final readonly class UsageWindowReading
{
    public function __construct(
        public string $limitId,
        public UsageWindowSlot $slot,
        public float|null $usedPercent,
        public int|null $durationMinutes,
        public CarbonImmutable|null $resetsAt,
        public UsageSource $source,
    ) {}
}
