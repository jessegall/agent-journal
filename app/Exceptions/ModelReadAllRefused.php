<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Model::all() reads every row with no reason; the read must say how many rows it wants.
 */
final class ModelReadAllRefused extends RuntimeException
{
    public static function for(string $model): self
    {
        return new self(
            sprintf(
                "%s::all() reads every row; use query()->get() for the newest rows, readAll('<reason>') or readInChunks.",
                $model,
            ),
        );
    }
}
