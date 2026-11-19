<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use LogicException;

/**
 * The same read, from the same place in the code, ran twice in one request, job or command: a loop reading one row
 * per item instead of one read for all of them.
 */
final class RepeatedReadRefused extends LogicException
{
    public static function at(string $callSite, string $query): self
    {
        return new self(
            "{$callSite} ran the same read more than ten times in this measurement, a loop reading one row per item: read every row it needs in one query, or run it inside a declared schedule such as readInChunks. Query: {$query}",
        );
    }
}
