<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

/**
 * A lifecycle callback asked for a command no state may ask for, such as a maintenance command.
 */
final class LifecycleCommandRefused extends LogicException
{
    public static function maintenance(string $command, string $origin): self
    {
        return new self("{$command} is a maintenance command, which {$origin} may not ask for.");
    }
}
