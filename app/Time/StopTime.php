<?php

declare(strict_types=1);

namespace App\Time;

use App\Processes\Contracts\StopTime as StopTimeContract;
use App\Time\Contracts\MonotonicClock;

/**
 * A stop time on the engine's monotonic clock: a fixed reading the work must end by.
 */
final readonly class StopTime implements StopTimeContract
{
    private const int NANOSECONDS_PER_MILLISECOND = 1_000_000;

    public function __construct(
        private MonotonicClock $clock,
        private int $stopNanoseconds,
    ) {}

    public function remainingMilliseconds(): int
    {
        return intdiv($this->stopNanoseconds - $this->clock->nanoseconds(), self::NANOSECONDS_PER_MILLISECOND);
    }
}
