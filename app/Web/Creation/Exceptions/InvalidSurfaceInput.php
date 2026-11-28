<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class InvalidSurfaceInput extends LogicException
{
    public static function context(string $type, string $field): self
    {
        return new self("{$type}::{$field} requires an admitted surface visit.");
    }

    public static function missing(string $type, string $field): self
    {
        return new self("The admitted visit supplies no value for {$type}::{$field}.");
    }

    public static function copy(string $copy): self
    {
        return new self("The window copy {$copy} must be twelve lowercase hexadecimal digits.");
    }
}
