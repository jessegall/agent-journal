<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use Carbon\CarbonImmutable;

/**
 * The estimated cost one result of a program reported, in US dollars, under the source that identifies that result
 * for good, and the UTC time, to the second, it was observed.
 */
final readonly class UsageCost
{
    public CarbonImmutable $observedAt;

    public function __construct(public string $sourceId, public UsdAmount $usd, CarbonImmutable $observedAt)
    {
        $this->observedAt = $observedAt->utc()->startOfSecond();
    }
}
