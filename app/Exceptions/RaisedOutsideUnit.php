<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An event source was written with no event unit open, outside every command: the facts it raised would reach no
 * listener, so the write is refused.
 */
final class RaisedOutsideUnit extends RuntimeException
{
    public static function for(string $model): self
    {
        return new self(
            "{$model} was written outside a command, so its facts would reach nobody; run it through the bus.",
        );
    }
}
