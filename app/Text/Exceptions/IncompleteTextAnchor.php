<?php

declare(strict_types=1);

namespace App\Text\Exceptions;

use LogicException;

/**
 * A stored text anchor with a field its type needs missing: the stored record is broken, not the caller's input.
 */
final class IncompleteTextAnchor extends LogicException
{
    public static function withoutType(): self
    {
        return new self('A stored text anchor has no type.');
    }

    public static function missing(string $type, string $field): self
    {
        return new self("A stored {$type} anchor has no {$field}.");
    }
}
