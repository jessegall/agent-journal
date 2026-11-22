<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Database\QueryException;
use RuntimeException;

/**
 * A storage statement a search source ran was cancelled at its deadline; the search counts the source as out of
 * time for this call.
 */
final class StatementTimedOut extends RuntimeException
{
    public static function after(int $milliseconds, QueryException $cancelled): self
    {
        return new self("A search statement was cancelled after {$milliseconds} ms.", previous: $cancelled);
    }
}
