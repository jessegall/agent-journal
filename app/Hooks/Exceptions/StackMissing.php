<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

final class StackMissing extends RuntimeException
{
    public static function forTarget(string $target): self
    {
        return new self("The stack of {$target} does not exist; its launch creates one.");
    }
}
