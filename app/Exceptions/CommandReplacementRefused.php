<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class CommandReplacementRefused extends RuntimeException
{
    public static function for(string $middleware, string $command): self
    {
        return new self(
            "The middleware {$middleware} may not replace {$command}; it is neither its owner's nor exported to it.",
        );
    }
}
