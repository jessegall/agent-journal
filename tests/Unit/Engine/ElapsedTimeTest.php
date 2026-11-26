<?php

declare(strict_types=1);

namespace Tests\Unit\Engine;

use App\Engine\Exceptions\MonotonicClockWentBack;
use App\Engine\Ticks\ElapsedTime;
use PHPUnit\Framework\TestCase;
use Tests\Support\FakeMonotonicClock;

/**
 * Elapsed time is whole nanoseconds between two monotonic readings, read as seconds or milliseconds, never negative.
 */
final class ElapsedTimeTest extends TestCase
{
    public function test_the_time_between_two_readings_reads_as_seconds_and_milliseconds(): void
    {
        $elapsed = ElapsedTime::between(10_000_000_000, 11_040_000_000);

        $this->assertEqualsWithDelta(1.04, $elapsed->seconds(), 1e-9);
        $this->assertSame(1040, $elapsed->milliseconds());
        $this->assertFalse($elapsed->isApproximate());
    }

    public function test_a_backward_pair_is_refused(): void
    {
        $this->expectException(MonotonicClockWentBack::class);

        ElapsedTime::between(11_000_000_000, 10_000_000_000);
    }

    public function test_spans_add_up_and_stay_approximate_when_either_is(): void
    {
        $sum = ElapsedTime::fromSeconds(1.5, true)->plus(ElapsedTime::between(0, 500_000_000));

        $this->assertSame(2000, $sum->milliseconds());
        $this->assertTrue($sum->isApproximate());
        $this->assertSame(0, ElapsedTime::zero(false)->milliseconds());
    }

    public function test_the_fake_clock_moves_only_when_advanced(): void
    {
        $clock = new FakeMonotonicClock(5);

        $this->assertSame(5, $clock->nanoseconds());
        $clock->advance(1_000_000_000);
        $this->assertSame(1_000_000_005, $clock->nanoseconds());
        $clock->set(42);
        $this->assertSame(42, $clock->nanoseconds());
    }
}
