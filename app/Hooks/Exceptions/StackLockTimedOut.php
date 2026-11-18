<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;
use Throwable;

final class StackLockTimedOut extends RuntimeException
{
    public static function after(int $milliseconds, Throwable $cause): self
    {
        return new self("The stack operation did not finish within {$milliseconds} ms and was rolled back.", previous: $cause);
    }
}
