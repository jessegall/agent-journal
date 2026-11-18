<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A stored profile revision whose launch policy no longer reads as one; it fails rather than stand in for a default.
 */
final class ProfileRevisionUnreadable extends RuntimeException
{
    public static function forRevision(string $revisionId, Throwable $failure): self
    {
        return new self("The launch policy of profile revision {$revisionId} cannot be read.", 0, $failure);
    }
}
