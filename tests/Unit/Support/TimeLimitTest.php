<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use PHPUnit\Framework\TestCase;
use Tests\Support\TimeLimits\TestAlarm;
use Tests\Support\TimeLimits\TestTimedOut;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every test has a time limit: a second by default, longer by #[TimeLimit], and a test past it is stopped by name.
 */
final class TimeLimitTest extends TestCase
{
    public function test_a_test_gets_one_second_unless_it_says_otherwise(): void
    {
        $this->assertSame(1, TestAlarm::secondsFor(self::class, 'test_a_test_gets_one_second_unless_it_says_otherwise'));
        $this->assertSame(3, TestAlarm::secondsFor(self::class, 'test_a_test_past_its_limit_is_stopped_by_name'));
    }

    #[TimeLimit(seconds: 3, reason: 'It waits out a one second alarm of its own to prove the stop.')]
    public function test_a_test_past_its_limit_is_stopped_by_name(): void
    {
        if (! TestAlarm::isAvailable()) {
            $this->markTestSkipped('pcntl is not loaded.');
        }

        TestAlarm::armForTest(self::class, 'test_a_test_gets_one_second_unless_it_says_otherwise');

        try {
            while (true) {
                usleep(10_000);
            }
        } catch (TestTimedOut $stopped) {
            $this->assertStringContainsString('test_a_test_gets_one_second_unless_it_says_otherwise', $stopped->getMessage());
        } finally {
            TestAlarm::armForTest(self::class, __FUNCTION__);
        }
    }
}
