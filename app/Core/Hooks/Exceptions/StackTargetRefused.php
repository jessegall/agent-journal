<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use RuntimeException;

final class StackTargetRefused extends RuntimeException
{
    public static function forTarget(string $target): self
    {
        return new self("This request may not change the stack of {$target}.");
    }
}
