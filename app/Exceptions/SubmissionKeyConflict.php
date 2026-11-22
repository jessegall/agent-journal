<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A submission key used again for a different comment.
 */
final class SubmissionKeyConflict extends RuntimeException implements CommandRefusal
{
    public static function for(string $key): self
    {
        return new self(
            "The submission key {$key} was already used for a different comment; use a new key for a new comment.",
        );
    }
}
