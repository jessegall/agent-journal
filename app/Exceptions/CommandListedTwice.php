<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class CommandListedTwice extends RuntimeException
{
    public static function for(string $command): self
    {
        return new self("The command {$command} is listed more than once; one owner lists it once.");
    }
}
