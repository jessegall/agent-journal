<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A to-many relation was eager loaded without saying how many of its rows to read.
 */
final class RelationReadUndeclared extends RuntimeException
{
    public static function for(string $relation): self
    {
        return new self(
            sprintf(
                'Eager loading %s reads all its rows without saying so; declare it with RelationRead::complete(max: n).',
                $relation,
            ),
        );
    }
}
