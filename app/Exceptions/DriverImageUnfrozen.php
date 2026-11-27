<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A contained session was asked for its driver image before it froze one: no start of it passed the image gate yet.
 */
final class DriverImageUnfrozen extends RuntimeException
{
    public static function of(string $sessionId): self
    {
        return new self("The session {$sessionId} froze no driver image yet.");
    }
}
