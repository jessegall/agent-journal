<?php

declare(strict_types=1);

namespace Tests\Support\Exceptions;

use LogicException;

/**
 * A unit test ran a command on the bus, which a command test does; a unit test stays isolated.
 */
final class BusUsedInUnitTest extends LogicException
{
    public static function by(string $class): self
    {
        return new self("The unit test {$class} ran a command on the bus: test the command in tests/Commands instead.");
    }
}
