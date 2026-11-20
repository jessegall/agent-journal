<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use ReflectionClass;
use ReflectionMethod;
use Tests\Support\TimeLimits\Exceptions\TestTimedOut;

/**
 * The alarm that stops a test past its limit: SIGALRM raises TestTimedOut inside the running test. A test gets one
 * second unless its method or class carries #[TimeLimit]; its preparation, the first migration included, gets
 * PREPARATION_SECONDS. The alarm remembers that it rang, so a timeout the test caught (an assertThrows around the
 * running code) is still reported as the timeout.
 */
final class TestAlarm
{
    public const int DEFAULT_SECONDS = 2;

    public const int PREPARATION_SECONDS = 60;

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
        if (! class_exists($className) || ! method_exists($className, $methodName)) {
            return self::DEFAULT_SECONDS;
        }

        foreach ([new ReflectionMethod($className, $methodName), new ReflectionClass($className)] as $declaration) {
            $limits = $declaration->getAttributes(TimeLimit::class);

            if ($limits !== []) {
                return $limits[0]->newInstance()->seconds;
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
        pcntl_async_signals(true);
        pcntl_signal(SIGALRM, function () use ($whenRunOut): never {
            try {
                $whenRunOut();
            } catch (TestTimedOut $timeout) {
                self::$rang = $timeout;

                throw $timeout;
            }
        });
        pcntl_alarm($seconds);
    }
}
