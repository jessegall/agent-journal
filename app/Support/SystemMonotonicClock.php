<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\MonotonicClock;

/**
 * The system's high-resolution monotonic clock.
 */
final readonly class SystemMonotonicClock implements MonotonicClock
{
    public function nanoseconds(): int
    {
        return hrtime(true);
    }
}
