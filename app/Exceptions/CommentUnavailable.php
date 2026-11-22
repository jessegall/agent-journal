<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A comment that is not on the record named, or that the caller may not read; both read the same.
 */
final class CommentUnavailable extends RuntimeException implements CommandRefusal
{
    public static function for(string $commentId): self
    {
        return new self("Comment {$commentId} is not available.");
    }

    public static function selectionOnWholeRecord(string $commentId): self
    {
        return new self("Comment {$commentId} is about the whole record, so it has no text to select.");
    }
}
