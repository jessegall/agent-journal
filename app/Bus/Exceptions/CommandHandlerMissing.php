<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandHandlerMissing extends RuntimeException
{
    public static function for(string $command, string $handler): self
    {
        return new self("The command {$command} has no handler: write {$handler}.");
    }
}
