<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use Carbon\CarbonImmutable;

/**
 * What the journal observed an account cost in one UTC calendar month: the sum, how many results it is made of, so a
 * real zero differs from nothing seen, and when the latest of them was observed.
 */
final readonly class MonthCost
{
    public function __construct(
        public UsdAmount $usd,
        public int $observations,
        public CarbonImmutable $lastObservedAt,
    ) {}
}
