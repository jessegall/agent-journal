<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

final class StackAlreadyClosed extends RuntimeException
{
    public static function forTarget(string $target): self
    {
        return new self("The stack of {$target} is closed.");
    }
}
