<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

final class StackTargetRefused extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<StackTargetRefused> */
    use ThrowsLater;

    public static function forTarget(string $target): self
    {
        return new self("This request may not change the stack of {$target}.");
    }
}
