<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A declared command line gave no word at all, as when every rule of its driver failed its condition.
 */
final class CommandLineEmpty extends LogicException
{
    public static function in(string $builder): self
    {
        return new self("The command line of {$builder} has no word: no rule of it applied.");
    }
}
