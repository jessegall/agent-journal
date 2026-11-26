<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A command run while a skill condition evaluates; conditions only read.
 */
final class ReadOnlyWriteRefused extends RuntimeException implements CommandRefusal
{
    public static function for(string $command, string $reader): self
    {
        return new self("{$command} was run while {$reader} was reading; it only reads, so it may send no command.");
    }
}
