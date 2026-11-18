<?php

declare(strict_types=1);

namespace App\Text\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A record whose text cannot be read in versions: it has no text to read or to point a comment at.
 */
final class TargetHasNoText extends RuntimeException implements CommandRefusal
{
    public static function for(string $type): self
    {
        return new self("A {$type} has no text to read or point at; a comment on it is about the whole record.");
    }
}
