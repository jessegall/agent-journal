<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A configured or requested row limit that is not a positive number within the largest page, or a read past a
 * page that a page holds.
 */
final class ReadLimitInvalid extends RuntimeException
{
    public static function configured(int $limit, int $pageMax): self
    {
        return new self("The reads.default_limit {$limit} must be between 1 and reads.page_max {$pageMax}.");
    }

    public static function withinPage(int $rows, int $max): self
    {
        return new self("A read of {$rows} rows fits a page of {$max}; ask for it with limit({$rows}).");
    }

    public static function rows(int $rows): self
    {
        return new self("A read of {$rows} rows is no read; ask for zero rows or more.");
    }
}
