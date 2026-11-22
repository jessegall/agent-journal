<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A state reference class that names no state type, so it cannot build a reference.
 */
final class StateTypeMissing extends LogicException
{
    public static function forClass(string $class): self
    {
        return new self("{$class} names no state type: override TYPE_KEY with the type it refers to.");
    }
}
