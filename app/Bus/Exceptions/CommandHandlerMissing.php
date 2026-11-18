<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandHandlerMissing extends RuntimeException
{
    public static function for(string $command): self
    {
        return new self("The command {$command} names no handler; give it #[HandledBy(...)].");
    }
}
