<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class MiddlewareListedTwice extends RuntimeException
{
    public static function for(string $middleware): self
    {
        return new self("The middleware {$middleware} is declared more than once for the same commands.");
    }
}
