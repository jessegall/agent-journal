<?php

declare(strict_types=1);

namespace App\Time\Contracts;

/**
 * A clock that only moves forward, for measuring how long passed; it says nothing about the time of day.
 */
interface MonotonicClock
{
    /**
     * A count of nanoseconds that only goes up, to measure how long something took.
     */
    public function nanoseconds(): int;
}
