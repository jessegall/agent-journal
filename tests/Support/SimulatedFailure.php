<?php

declare(strict_types=1);

namespace Tests\Support;

use RuntimeException;

/**
 * A fault a test double raises on purpose, standing in for a failure of the database, the network or a listener.
 */
final class SimulatedFailure extends RuntimeException
{
    public static function of(string $what): self
    {
        return new self($what);
    }
}
