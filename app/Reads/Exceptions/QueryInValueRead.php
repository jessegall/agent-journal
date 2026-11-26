<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A query asked while a value is read or rendered, such as inside an accessor; values are read from what is loaded.
 */
final class QueryInValueRead extends RuntimeException
{
    public static function during(string $boundary): self
    {
        return new self("{$boundary} ran a query; load what it needs before reading or rendering values.");
    }
}
