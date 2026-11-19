<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class MiddlewareSkippedCommand extends RuntimeException
{
    public static function by(string $middleware): self
    {
        return new self(
            sprintf(
                'The middleware %s returned without running the command; refuse it with CommandRefused or call the next step.',
                $middleware,
            ),
        );
    }
}
