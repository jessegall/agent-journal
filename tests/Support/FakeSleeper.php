<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Time\Contracts\Sleeper;

/**
 * Sleeps by moving the fake monotonic clock, with an optional stall added to the first sleep.
 */
final class FakeSleeper implements Sleeper
{
    public function __construct(
        private readonly FakeMonotonicClock $clock,
        private int $firstStallNanoseconds = 0,
    ) {}

    public function sleep(int $nanoseconds): void
    {
        $this->clock->advance($nanoseconds + $this->firstStallNanoseconds);
        $this->firstStallNanoseconds = 0;
    }
}
