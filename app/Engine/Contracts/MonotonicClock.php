<?php

declare(strict_types=1);

namespace App\Engine\Contracts;

/**
 * A clock that only moves forward, for measuring how long passed; it says nothing about the time of day.
 */
interface MonotonicClock
{
    public function nanoseconds(): int;
}
