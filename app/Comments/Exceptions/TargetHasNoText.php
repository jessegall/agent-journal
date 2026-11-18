<?php

declare(strict_types=1);

namespace App\Comments\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A text comment on a record whose text cannot be read in versions.
 */
final class TargetHasNoText extends RuntimeException implements CommandRefusal
{
    public static function for(string $type): self
    {
        return new self("A {$type} has no text to point at; leave a comment on the whole record instead.");
    }
}
