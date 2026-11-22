<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * `tunler status --json` printed something other than a JSON object.
 */
final class TunlerStatusUnreadable extends RuntimeException
{
    public static function because(Throwable|null $previous = null): self
    {
        return new self('Tunler did not report its login status as a JSON object.', previous: $previous);
    }
}
