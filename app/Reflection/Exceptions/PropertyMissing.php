<?php

declare(strict_types=1);

namespace App\Reflection\Exceptions;

use RuntimeException;

/**
 * A reflected class was asked for a property it neither declares nor inherits.
 */
final class PropertyMissing extends RuntimeException
{
    public static function on(string $class, string $property): self
    {
        return new self("The class {$class} has no property \${$property}.");
    }
}
