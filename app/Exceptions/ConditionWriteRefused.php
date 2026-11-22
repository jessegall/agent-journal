<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A command run while a skill condition evaluates; conditions only read.
 */
final class ConditionWriteRefused extends RuntimeException implements CommandRefusal
{
    public static function for(string $command): self
    {
        return new self("{$command} was run while a skill condition was evaluating; a condition only reads.");
    }
}
