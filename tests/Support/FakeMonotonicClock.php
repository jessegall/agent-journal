<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Time\MonotonicClock;

/**
 * A monotonic clock that moves only when a test moves it.
 */
final class FakeMonotonicClock implements MonotonicClock
{
    public function __construct(private int $now = 0) {}

    public function nanoseconds(): int
    {
        return $this->now;
    }

    public function advance(int $nanoseconds): void
    {
        $this->now += $nanoseconds;
    }

    public function set(int $nanoseconds): void
    {
        $this->now = $nanoseconds;
    }
}
