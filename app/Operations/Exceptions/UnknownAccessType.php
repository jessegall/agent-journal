<?php

declare(strict_types=1);

namespace App\Operations\Exceptions;

use InvalidArgumentException;

/**
 * An access type name no policy knows; unknown access is never granted.
 */
final class UnknownAccessType extends InvalidArgumentException
{
    public static function forKey(string $key): self
    {
        return new self(
            "{$key} is not an access type; use read, search, create, edit, delete, execute, test, build, network, publish, delegate or admin.",
        );
    }
}
