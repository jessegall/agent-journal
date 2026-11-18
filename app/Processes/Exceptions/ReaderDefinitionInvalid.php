<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use InvalidArgumentException;

/**
 * A reader definition breaks its own grammar or limits; it is refused before it reads any output.
 */
final class ReaderDefinitionInvalid extends InvalidArgumentException
{
    public static function placeholder(string $placeholder): self
    {
        return new self("The placeholder '{$placeholder}' is not of the form {name:int}, {name:word} or {name:rest}.");
    }

    public static function limit(string $limit, int $value): self
    {
        return new self("The reader limit {$limit} must be above zero, not {$value}.");
    }

    public static function field(string $field): self
    {
        return new self("A reader definition field is missing or of the wrong type: {$field}.");
    }
}
