<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use Carbon\CarbonImmutable;

/**
 * The estimated cost one result of a driver reported, in US dollars, under the source that identifies that result
 * for good, and the Unix second it was observed.
 */
final readonly class UsageCost
{
    public function __construct(public string $sourceId, public UsdAmount $usd, public int $observedAt) {}

    public static function of(string $sourceId, UsdAmount $usd, CarbonImmutable $observedAt): self
    {
        return new self($sourceId, $usd, $observedAt->getTimestamp());
    }

    public function observedTime(): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestampUTC($this->observedAt);
    }
}
