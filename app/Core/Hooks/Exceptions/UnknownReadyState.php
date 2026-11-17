<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use InvalidArgumentException;

/**
 * A launch named a role whose bottom state is not built in, so no agent may start under it.
 */
final class UnknownReadyState extends InvalidArgumentException
{
    public static function forKey(string $typeKey): self
    {
        return new self("No bottom state is built in under {$typeKey}, so an agent cannot be launched with it.");
    }
}
