<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

/**
 * A hook call from a driver process older than the one its runtime now runs; it changes nothing.
 */
final class StaleProcessGeneration extends RuntimeException
{
    public static function of(int $called, int $current): self
    {
        return new self(
            "A hook call of process generation {$called} is older than the runtime's generation {$current}.",
        );
    }
}
