<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use PHPUnit\Framework\TestCase;
use Tests\Fixtures\EntryPointTests\Kinds\tests\Loose\LooseTest;
use Tests\Support\TimeLimits\Exceptions\TestTimedOut;
use Tests\Support\TimeLimits\TestAlarm;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every test has a time limit: two seconds by default, one for a unit test, longer by #[TimeLimit]. A test that spends its limit in its own
 * processor time, or WALL_CLOCK_FACTOR times it on the clock, is stopped by name.
 */
final class TimeLimitTest extends TestCase
{
    public function test_a_test_gets_two_seconds_and_a_unit_test_one_unless_it_says_otherwise(): void
    {
        $this->assertSame(2, TestAlarm::secondsFor(LooseTest::class, 'test_nothing_it_proves_has_a_kind'));
        $this->assertSame(
            1,
            TestAlarm::secondsFor(self::class, 'test_a_test_gets_two_seconds_and_a_unit_test_one_unless_it_says_otherwise'),
        );
        $this->assertSame(3, TestAlarm::secondsFor(self::class, 'test_a_test_past_its_limit_is_stopped_by_name'));
    }

    #[TimeLimit(seconds: 3, reason: 'It works out a one second alarm of its own to prove the stop.')]
    public function test_a_test_past_its_limit_is_stopped_by_name(): void
    {
        if (! TestAlarm::isAvailable()) {
            $this->markTestSkipped('pcntl is not loaded.');
        }

        TestAlarm::armForTest(self::class, 'limitOfOneSecond');

        try {
            $this->workUntilStopped();
        } catch (TestTimedOut $stopped) {
            $this->assertStringContainsString('limitOfOneSecond', $stopped->getMessage());
        } finally {
            TestAlarm::armForTest(self::class, __FUNCTION__);
        }
    }

    #[TimeLimit(seconds: 8, reason: 'It waits out the clock ceiling of a one second alarm, four seconds.')]
    public function test_a_test_that_only_waits_is_stopped_at_the_clock_ceiling(): void
    {
        if (! TestAlarm::isAvailable()) {
            $this->markTestSkipped('pcntl is not loaded.');
        }

        $start = hrtime(true);
        $waited = 0.0;
        TestAlarm::armForTest(self::class, 'limitOfOneSecond');

        try {
            while (true) {
                usleep(10_000);
            }
        } catch (TestTimedOut) {
            $waited = (hrtime(true) - $start) / 1e9;
        } finally {
            TestAlarm::armForTest(self::class, __FUNCTION__);
        }

        $this->assertGreaterThanOrEqual(TestAlarm::WALL_CLOCK_FACTOR - 1, $waited);
    }

    #[TimeLimit(seconds: 3, reason: 'It works out a one second alarm of its own to prove a caught timeout is kept.')]
    public function test_a_timeout_the_test_caught_is_still_thrown_as_the_timeout(): void
    {
        if (! TestAlarm::isAvailable()) {
            $this->markTestSkipped('pcntl is not loaded.');
        }

        TestAlarm::armForTest(self::class, 'limitOfOneSecond');

        try {
            $this->workUntilStopped();
        } catch (TestTimedOut) {
            $this->assertTrue(TestAlarm::hasRung());
            $this->assertStringContainsString('limitOfOneSecond', $this->timeoutThrown()->getMessage());
        } finally {
            TestAlarm::armForTest(self::class, __FUNCTION__);
        }

        $this->assertFalse(TestAlarm::hasRung());
    }

    /**
     * The limit the stop tests arm: no test of its own, only its attribute is read.
     */
    #[TimeLimit(seconds: 1, reason: 'The alarm the stop tests arm and run out.')]
    public function limitOfOneSecond(): void {}

    private function workUntilStopped(): never
    {
        $sum = 0;

        while (true) {
            $sum = ($sum + 1) % 1_000_003;
        }
    }

    private function timeoutThrown(): TestTimedOut
    {
        try {
            TestAlarm::throwTimeout();
        } catch (TestTimedOut $timeout) {
            return $timeout;
        }
    }
}
