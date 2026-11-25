<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\StopTime as StopTimeContract;
use App\Contracts\Processes\StopTimes as StopTimesContract;
use App\Contracts\Time\MonotonicClock;

final readonly class StopTimes implements StopTimesContract
{
    public function __construct(private MonotonicClock $clock) {}

    public function at(int $nanoseconds): StopTimeContract
    {
        return new StopTime($this->clock, $nanoseconds);
    }
}
