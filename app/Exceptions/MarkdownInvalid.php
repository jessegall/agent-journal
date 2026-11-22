<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * Text that is not valid Markdown for a document: bad encoding or a code fence never closed.
 */
final class MarkdownInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function encoding(): self
    {
        return new self('The text is not valid UTF-8; save it as UTF-8 and send it again.');
    }

    public static function unclosedFence(int $line): self
    {
        return new self("The code fence opened on line {$line} is never closed; close it with the same fence.");
    }
}
