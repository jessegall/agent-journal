<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A search would hold more private state than its limit: the search ends as incomplete instead of being cut short.
 */
final class SearchStateFull extends RuntimeException
{
    public static function over(int $limit): self
    {
        return new self("A search holds at most {$limit} bytes of state.");
    }
}
