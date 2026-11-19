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
            sprintf(
                'A plain read may take at most %s rows, not %s; use readLimit(%s) for a known larger set, readInChunks for a scan, or paginate.',
                $pageMax,
                $rows,
                $rows,
            ),
        );
    }
}
