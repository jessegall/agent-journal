<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class MiddlewareDeclarationInvalid extends RuntimeException
{
    public static function for(string $middleware, string $problem): self
    {
        return new self("The middleware {$middleware} is not valid: {$problem}.");
    }
}
