<?php

declare(strict_types=1);

namespace App\Engine\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * The engine's database session is gone; the engine never reconnects, so the process ends and PostgreSQL has released
 * its lock.
 */
final class EngineConnectionLost extends RuntimeException
{
    /**
     * @use ThrowsLater<EngineConnectionLost>
     */
    use ThrowsLater;

    public static function onConnection(string $connection): self
    {
        return new self("The engine's database connection {$connection} was lost; the engine does not reconnect.");
    }
}
