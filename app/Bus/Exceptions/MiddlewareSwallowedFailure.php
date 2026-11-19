<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;
use Throwable;

final class MiddlewareSwallowedFailure extends RuntimeException
{
    public static function by(string $middleware, Throwable $failure): self
    {
        return new self(
            "The middleware {$middleware} caught a failure and went on; let it through or refuse the command.",
            previous: $failure,
        );
    }
}
