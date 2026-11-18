<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class HandlerServesTwoCommands extends RuntimeException
{
    public static function for(string $handler): self
    {
        return new self("The handler {$handler} serves more than one command; give each command its own handler.");
    }
}
