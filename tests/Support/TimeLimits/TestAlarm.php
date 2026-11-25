<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use App\Support\ReflectedType;
use Tests\Support\TimeLimits\Exceptions\ProcessorTimeUnreadable;
use Tests\Support\TimeLimits\Exceptions\TestTimedOut;

/**
 * The alarm that stops a test past its limit: SIGALRM raises TestTimedOut inside the running test. A test gets
 * DEFAULT_SECONDS unless its method or class carries #[TimeLimit]; its preparation, the first migration included, gets
 * PREPARATION_SECONDS. The limit counts the test's own processor time, so a test kept waiting by a busy machine is
 * not failed for it, and WALL_CLOCK_FACTOR times the limit on the clock still stops one that hangs. The
 * alarm remembers that it rang, so a timeout the test caught (an assertThrows around the code) is still reported.
 */
final class TestAlarm
{
    public const int DEFAULT_SECONDS = 2;

    public const int PREPARATION_SECONDS = 60;

    /**
     * How many times its limit a test may take on the clock while its own processor time stays under the limit.
     */
    public const int WALL_CLOCK_FACTOR = 4;

    private static TestTimedOut|null $rang = null;

    public static function isAvailable(): bool
    {
        return function_exists('pcntl_alarm')
            && function_exists('pcntl_signal')
            && function_exists('pcntl_async_signals');
    }

    public static function armForPreparation(string $test): void
    {
        self::arm(self::PREPARATION_SECONDS, fn () => throw TestTimedOut::preparing($test, self::PREPARATION_SECONDS));
    }

    public static function armForTest(string $className, string $methodName): void
    {
        $seconds = self::secondsFor($className, $methodName);
        self::arm($seconds, fn () => throw TestTimedOut::after("{$className}::{$methodName}", $seconds));
    }

    public static function disarm(): void
    {
        pcntl_alarm(0);
    }

    /**
     * Whether the alarm rang for the test now running, even when the test caught what it threw.
     */
    public static function hasRung(): bool
    {
        return self::$rang !== null;
    }

    /**
     * @throws TestTimedOut always: the timeout the alarm raised for the running test
     */
    public static function throwTimeout(): never
    {
        throw self::$rang ?? TestTimedOut::after('the running test', self::DEFAULT_SECONDS);
    }

    public static function secondsFor(string $className, string $methodName): int
    {
        $test = ReflectedType::find($className)->filter(fn (ReflectedType $type) => $type->isClass());

        if ($test->isEmpty() || ! $test->get()->hasMethod($methodName)) {
            return self::DEFAULT_SECONDS;
        }

        foreach ([$test->get()->method($methodName), $test->get()] as $declaration) {
            if ($declaration->hasAttribute(TimeLimit::class)) {
                return $declaration->attribute(TimeLimit::class)->seconds;
            }
        }

        return self::DEFAULT_SECONDS;
    }

    /**
     * @param  callable(): never  $whenRunOut
     */
    private static function arm(int $seconds, callable $whenRunOut): void
    {
        self::$rang = null;
        $processorStart = self::processorSeconds();
        $clockStart = hrtime(true);
        $clockLimit = $seconds * self::WALL_CLOCK_FACTOR;
        pcntl_async_signals(true);
        pcntl_signal(SIGALRM, function () use ($seconds, $whenRunOut, $processorStart, $clockStart, $clockLimit): void {
            $processorLeft = $seconds - (self::processorSeconds() - $processorStart);
            $clockLeft = $clockLimit - (hrtime(true) - $clockStart) / 1e9;

            if ($processorLeft > 0 && $clockLeft > 0) {
                pcntl_alarm(max(1, (int) ceil(min($processorLeft, $clockLeft))));

                return;
            }

            try {
                $whenRunOut();
            } catch (TestTimedOut $timeout) {
                self::$rang = $timeout;

                throw $timeout;
            }
        });
        pcntl_alarm($seconds);
    }

    /**
     * The processor time this process has spent, in its own code and in the kernel on its behalf.
     */
    private static function processorSeconds(): float
    {
        $usage = getrusage();

        if ($usage === false) {
            throw ProcessorTimeUnreadable::fromSystem();
        }

        return $usage['ru_utime.tv_sec'] + $usage['ru_utime.tv_usec'] / 1e6
            + $usage['ru_stime.tv_sec'] + $usage['ru_stime.tv_usec'] / 1e6;
    }
}
