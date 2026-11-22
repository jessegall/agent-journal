<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\StopTime;
use App\Contracts\Processes\StopTimes;
use App\Contracts\Time\MonotonicClock;

final readonly class MonotonicStopTimes implements StopTimes
{
    public function __construct(private MonotonicClock $clock) {}

    public function at(int $nanoseconds): StopTime
    {
        return new MonotonicStop($this->clock, $nanoseconds);
    }
}
