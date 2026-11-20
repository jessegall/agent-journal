<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Bus\Contracts\StopTime;
use App\Bus\Contracts\StopTimes;
use App\Engine\Contracts\MonotonicClock;

final readonly class MonotonicStopTimes implements StopTimes
{
    public function __construct(private MonotonicClock $clock) {}

    public function at(int $nanoseconds): StopTime
    {
        return new MonotonicStop($this->clock, $nanoseconds);
    }
}
