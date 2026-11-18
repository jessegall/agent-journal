<?php

declare(strict_types=1);

namespace App\Operations\Exceptions;

use InvalidArgumentException;

/**
 * A resource area name no policy knows.
 */
final class UnknownResourceArea extends InvalidArgumentException
{
    public static function forKey(string $key): self
    {
        return new self("{$key} is not a resource area; use workspace, scratch, journal.content, journal.work, journal.control, provider.connection or protected.");
    }
}
