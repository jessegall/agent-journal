<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A relation read by touching it on a model, one query per model; it must be loaded for all the models at once.
 */
final class LazyLoadRefused extends RuntimeException
{
    public static function for(string $model, string $relation): self
    {
        return new self(
            "{$model}->{$relation} was read without being loaded; load it with with('{$relation}') or "
                ."load('{$relation}') on the whole set first.",
        );
    }
}
