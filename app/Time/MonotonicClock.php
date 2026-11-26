<?php

declare(strict_types=1);

namespace App\Time;

use App\Time\Contracts\MonotonicClock as MonotonicClockContract;

/**
 * The system's high-resolution monotonic clock.
 */
final readonly class MonotonicClock implements MonotonicClockContract
{
    public function nanoseconds(): int
    {
        return hrtime(true);
    }
}
