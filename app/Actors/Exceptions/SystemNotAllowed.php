<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * The system ran a command that does not name the system as its actor.
 */
final class SystemNotAllowed extends RuntimeException implements CommandRefusal
{
    public static function forCommand(string $command): self
    {
        return new self("The journal itself may not run {$command}; only commands that require the system as their actor may.");
    }
}
