<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Accounts\UsageWindowSlot;
use Carbon\CarbonImmutable;

/**
 * One observed reading of a limit window: the provider's limit, the window, how much of it is used in percent, how
 * long it lasts and the Unix second it resets, each only when the driver reported it.
 */
final readonly class UsageWindowReading
{
    public function __construct(
        public string $limitId,
        public UsageWindowSlot $slot,
        public float|null $usedPercent,
        public int|null $durationMinutes,
        public int|null $resetsAt,
        public UsageSource $source,
    ) {}

    public function resetTime(): CarbonImmutable|null
    {
        if ($this->resetsAt === null) {
            return null;
        }

        return CarbonImmutable::createFromTimestampUTC($this->resetsAt);
    }
}
