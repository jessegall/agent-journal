<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandDispatcherMissing extends RuntimeException
{
    public static function forCommand(string $command): self
    {
        return new self("{$command} was asked who dispatched it before the bus bound its dispatcher.");
    }
}
