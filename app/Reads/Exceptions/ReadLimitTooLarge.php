<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A plain read asked for more rows than the largest page; a larger read is named.
 */
final class ReadLimitTooLarge extends RuntimeException
{
    public static function rows(int $rows, int $pageMax): self
    {
        return new self(
            "A plain read may take at most {$pageMax} rows, not {$rows}; use readLimit({$rows}) for a known larger set, readInChunks for a scan, or paginate.",
        );
    }
}
