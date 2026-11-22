<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A relation declared complete up to a number of rows holds more.
 */
final class ReadLimitExceeded extends RuntimeException
{
    public static function forRelation(string $relation, int $max): self
    {
        return new self(
            "The relation {$relation} holds more than its declared {$max} rows; page it or read it in chunks.",
        );
    }
}
