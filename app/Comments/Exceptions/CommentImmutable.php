<?php

declare(strict_types=1);

namespace App\Comments\Exceptions;

use LogicException;

/**
 * A change to a comment after it was written: comments are kept exactly as they were left.
 */
final class CommentImmutable extends LogicException
{
    public static function for(string $commentId): self
    {
        return new self("Comment {$commentId} cannot change once it is written.");
    }
}
