<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A read that asks for the whole text at once, or for filtered lines, which a bounded read in order cannot return.
 */
final class TextSelectionRefused extends RuntimeException implements CommandRefusal
{
    public static function unbounded(): self
    {
        return new self('A read returns a bounded part; read the whole text a part at a time from its next line.');
    }

    public static function filtered(): self
    {
        return new self('A read returns lines in order; bullets and word filters are not read this way.');
    }
}
