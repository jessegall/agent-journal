<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\MonotonicClock;
use App\Contracts\StopTime;
use App\Contracts\StopTimes;

final readonly class MonotonicStopTimes implements StopTimes
{
    public function __construct(private MonotonicClock $clock) {}

    public function at(int $nanoseconds): StopTime
    {
        return new MonotonicStop($this->clock, $nanoseconds);
    }
}
