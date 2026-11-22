<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An attribute was built as a class other than the one its selection asked for.
 */
final class AttributeTypeUnexpected extends RuntimeException
{
    public static function for(string $attribute, string $type): self
    {
        return new self("The attribute {$attribute} was built as a class that is no {$type}.");
    }
}
