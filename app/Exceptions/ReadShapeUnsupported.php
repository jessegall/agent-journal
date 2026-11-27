<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A way of reading rows the bounded read policy does not offer.
 */
final class ReadShapeUnsupported extends RuntimeException
{
    public static function method(string $method): self
    {
        return new self($method.'() is not a bounded read; use readInChunks($size, $each) instead.');
    }
}
