<?php

declare(strict_types=1);

namespace App\Comments\Exceptions;

use LogicException;

/**
 * A stored comment whose anchor columns are partly set: the row is broken, never the caller's input.
 */
final class CommentAnchorCorrupt extends LogicException
{
    public static function for(string $commentId, string $reason): self
    {
        return new self("Comment {$commentId} has a half-filled anchor: {$reason}.");
    }
}
