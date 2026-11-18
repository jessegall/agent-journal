<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A stored sharing column does not hold the JSON shape its cast writes.
 */
final class StoredShareColumnInvalid extends RuntimeException
{
    public static function for(string $table, string $column, string $id, Throwable $cause): self
    {
        return new self("The {$column} of {$table} row {$id} does not hold the shape sharing writes there.", previous: $cause);
    }
}
