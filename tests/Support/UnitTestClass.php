<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Which test classes are unit tests: those of tests/Unit and of a domain's tests/Unit, read from the namespace.
 */
final readonly class UnitTestClass
{
    private const string NAMESPACE = '/^(Tests|Domain\\\\\w+\\\\Tests)\\\\Unit\\\\/';

    public static function is(string $class): bool
    {
        return preg_match(self::NAMESPACE, $class) === 1;
    }
}
