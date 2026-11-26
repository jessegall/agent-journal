<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Support\Hosts\StreamRate;
use PHPUnit\Framework\TestCase;

/**
 * A worker driving a terminal reads at least four frames a second, a viewer what it asks, and with neither nothing
 * streams.
 */
final class StreamRateTest extends TestCase
{
    public function test_the_rate_follows_who_reads_the_frames(): void
    {
        $this->assertSame(
            [4, 10, 2, 0],
            [StreamRate::of(true, 0), StreamRate::of(true, 10), StreamRate::of(false, 2), StreamRate::of(false, 0)],
        );
    }
}
