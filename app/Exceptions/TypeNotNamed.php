<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A union or intersection type was asked for the one name only a named type has.
 */
final class TypeNotNamed extends RuntimeException
{
    public static function for(string $type): self
    {
        return new self("The type {$type} is a union or intersection, not one named type.");
    }
}
