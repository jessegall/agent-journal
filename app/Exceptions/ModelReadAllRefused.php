<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Model::all() reads every row of a table; a read is bounded by its where, a page limit or a scan by key.
 */
final class ModelReadAllRefused extends RuntimeException
{
    public static function for(string $model): self
    {
        return new self(
            sprintf(
                '%s::all() reads every row; read through query() with a where that bounds the set, limit(n) for a page, or chunkById for a scan.',
                $model,
            ),
        );
    }
}
