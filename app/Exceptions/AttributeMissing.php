<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A declaration was asked for an attribute it does not carry.
 */
final class AttributeMissing extends RuntimeException
{
    public static function on(string $declaration, string $type): self
    {
        return new self("The {$declaration} carries no attribute {$type}.");
    }
}
