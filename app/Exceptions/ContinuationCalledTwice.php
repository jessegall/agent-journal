<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class ContinuationCalledTwice extends RuntimeException
{
    public static function by(string $middleware): self
    {
        return new self("The middleware {$middleware} called the next step twice; call it once.");
    }
}
