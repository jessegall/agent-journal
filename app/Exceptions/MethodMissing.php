<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A reflected class was asked for a method it neither declares nor inherits.
 */
final class MethodMissing extends RuntimeException
{
    public static function on(string $class, string $method): self
    {
        return new self("The class {$class} has no method {$method}.");
    }
}
