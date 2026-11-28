<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A way of scanning rows that is not a metered scan by key.
 */
final class ReadShapeUnsupported extends RuntimeException
{
    public static function method(string $method): self
    {
        return new self($method.'() is not a metered scan by key; use chunkById($size, $each) instead.');
    }
}
