<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandResultChanged extends RuntimeException
{
    public static function by(string $middleware): self
    {
        return new self(
            sprintf(
                "The middleware %s changed the command's result; a middleware may look at a result, not change it.",
                $middleware,
            ),
        );
    }
}
