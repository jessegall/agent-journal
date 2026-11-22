<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An attribute's constructor asked for the very attribute it was building.
 */
final class AttributeBuiltRecursively extends RuntimeException
{
    public static function on(string $declaration, string $attribute): self
    {
        return new self("Building the attribute {$attribute} of the {$declaration} asked for itself.");
    }
}
