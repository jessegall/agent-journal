<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A model's save of its own row returned false, so the transition stops before it raises any fact.
 */
final class RowWriteRefused extends RuntimeException
{
    public static function for(string $model): self
    {
        return new self("The save of a {$model} row was refused, so it raised no fact.");
    }
}
