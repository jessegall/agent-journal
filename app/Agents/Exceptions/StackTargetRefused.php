<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class StackTargetRefused extends RuntimeException implements CommandRefusal
{
    public static function forTarget(string $target): self
    {
        return new self("This request may not change the stack of {$target}.");
    }
}
