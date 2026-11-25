<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

final class StackMissing extends RuntimeException
{
    /** @use ThrowsLater<StackMissing> */
    use ThrowsLater;

    public static function forTarget(string $target): self
    {
        return new self("The stack of {$target} does not exist; its start creates one.");
    }
}
