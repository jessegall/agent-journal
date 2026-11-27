<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Hosts\StreamRate;
use PHPUnit\Framework\TestCase;

/**
 * A worker driving a terminal reads at least four frames a second, or the faster rate a viewer asks.
 */
final class StreamRateTest extends TestCase
{
    public function test_a_worker_reads_at_least_its_minimum_and_a_faster_viewer_keeps_its_rate(): void
    {
        $this->assertSame([4, 10], [StreamRate::withWorker(0), StreamRate::withWorker(10)]);
    }
}
