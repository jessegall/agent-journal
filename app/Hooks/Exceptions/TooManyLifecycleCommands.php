<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

/**
 * A state's enter, resume or exit returned more commands than one callback may.
 */
final class TooManyLifecycleCommands extends LogicException
{
    public static function count(int $count, int $most): self
    {
        return new self("A lifecycle callback returned {$count} commands. It can return at most {$most}.");
    }
}
