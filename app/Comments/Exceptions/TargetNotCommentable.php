<?php

declare(strict_types=1);

namespace App\Comments\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A record that takes no comments.
 */
final class TargetNotCommentable extends RuntimeException implements CommandRefusal
{
    public static function for(string $type): self
    {
        return new self("A {$type} takes no comments.");
    }
}
