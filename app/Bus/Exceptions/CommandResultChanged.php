<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandResultChanged extends RuntimeException
{
    public static function by(string $middleware): self
    {
        return new self(
            "The middleware {$middleware} changed the command's result; a middleware may look at a result, not "
                .'change it.',
        );
    }
}
