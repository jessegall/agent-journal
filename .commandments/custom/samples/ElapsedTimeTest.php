<?php

declare(strict_types=1);

namespace Tests\Samples;

use PHPUnit\Framework\TestCase;

/**
 * A test that asserts on elapsed time the rule must find, and a polling deadline that waits for a process it must pass.
 */
final class ElapsedTimeTest extends TestCase
{
    public function test_a_stop_is_quick(): void
    {
        $started = microtime(true);
        $this->stop();

        // @sin ElapsedTimeAssertionDetector
        $this->assertLessThan(1.0, microtime(true) - $started);
    }

    private function stop(): void
    {
        // @righteous ElapsedTimeAssertionDetector
        $deadline = microtime(true) + 5;

        while (microtime(true) < $deadline) {
            usleep(1_000);
        }
    }
}
