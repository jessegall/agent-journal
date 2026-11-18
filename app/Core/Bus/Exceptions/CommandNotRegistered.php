<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class CommandNotRegistered extends RuntimeException
{
    public static function for(string $command): self
    {
        return new self("The command {$command} is not registered; list it in its owner's commands().");
    }
}
