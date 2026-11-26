<?php

declare(strict_types=1);

namespace App\Time;

use App\Processes\Contracts\StopTime as StopTimeContract;
use App\Processes\Contracts\StopTimes as StopTimesContract;
use App\Time\Contracts\MonotonicClock;

final readonly class StopTimes implements StopTimesContract
{
    public function __construct(private MonotonicClock $clock) {}

    public function at(int $nanoseconds): StopTimeContract
    {
        return new StopTime($this->clock, $nanoseconds);
    }
}
