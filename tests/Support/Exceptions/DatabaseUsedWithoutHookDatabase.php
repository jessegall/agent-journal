<?php

declare(strict_types=1);

namespace Tests\Support\Exceptions;

use LogicException;

/**
 * A test class without RefreshHookDatabase tried a query, so it is stopped before the query reaches any database.
 */
final class DatabaseUsedWithoutHookDatabase extends LogicException
{
    public static function by(string $class): self
    {
        return new self(
            "The test class {$class} queried the database without RefreshHookDatabase: use "
                .'Tests\\Support\\RefreshHookDatabase in it.',
        );
    }
}
