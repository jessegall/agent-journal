<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use ReflectionClass;
use ReflectionMethod;

/**
 * The alarm that stops a test past its limit: SIGALRM raises TestTimedOut inside the running test. A test gets one
 * second unless its method or class carries #[TimeLimit]; its preparation, the first migration included, gets
 * PREPARATION_SECONDS.
 */
final class TestAlarm
{
    public const int DEFAULT_SECONDS = 1;

    public const int PREPARATION_SECONDS = 60;

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
        pcntl_async_signals(true);
        pcntl_signal(SIGALRM, fn () => $whenRunOut());
        pcntl_alarm($seconds);
    }
}
