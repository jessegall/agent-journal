<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A session that froze one driver image was handed another: a session keeps the image it froze, so a rebuild of
 * another digest never replaces it.
 */
final class DriverImageMismatch extends RuntimeException
{
    public static function of(string $sessionId, string $frozen, string $offered): self
    {
        return new self("The session {$sessionId} froze the driver image {$frozen}, not {$offered}.");
    }
}
