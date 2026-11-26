<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * One source line alone is longer than a part may be, so no bounded read can return it.
 */
final class TextLineTooLong extends RuntimeException implements CommandRefusal
{
    public static function at(int $line, int $limit): self
    {
        return new self("Line {$line} alone is longer than {$limit} bytes, the most one read returns.");
    }
}
