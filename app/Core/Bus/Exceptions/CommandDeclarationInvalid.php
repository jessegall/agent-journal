<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class CommandDeclarationInvalid extends RuntimeException
{
    public static function for(string $class, string $problem): self
    {
        return new self("{$class} is not a valid command or handler: {$problem}.");
    }
}
