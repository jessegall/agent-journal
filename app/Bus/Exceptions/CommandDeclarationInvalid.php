<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandDeclarationInvalid extends RuntimeException
{
    public static function for(string $class, string $problem): self
    {
        return new self("{$class} is not a valid command or handler: {$problem}.");
    }

    public static function exportedButNotRegistered(string $owner, string $command): self
    {
        return new self("{$owner} exports the command {$command} but does not register it; register it in its commands, or stop exporting it.");
    }
}
