<?php

declare(strict_types=1);

namespace Tests\Support\Exceptions;

use LogicException;

/**
 * A unit test sent a request into the application, which a route test does; a unit test stays isolated.
 */
final class HttpUsedInUnitTest extends LogicException
{
    public static function by(string $class): self
    {
        return new self(
            "The unit test {$class} sent a request into the application: test the route in tests/Routes instead.",
        );
    }
}
