<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class HandlerInOtherOwner extends RuntimeException
{
    public static function for(string $command, string $handler): self
    {
        return new self(
            "The handler {$handler} of {$command} belongs to another owner; a handler lives with its command.",
        );
    }
}
