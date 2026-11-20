<?php

declare(strict_types=1);

namespace App\Comments\Exceptions;

use LogicException;
use Throwable;

/**
 * A stored comment whose anchor columns are partly set: the row is broken, never the caller's input.
 */
final class CommentAnchorCorrupt extends LogicException
{
    public static function for(string $commentId, Throwable $cause): self
    {
        return new self("Comment {$commentId} has a half-filled anchor: {$cause->getMessage()}.", previous: $cause);
    }
}
