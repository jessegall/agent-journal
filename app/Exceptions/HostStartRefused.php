<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * The protected host refused a local start or stop, or could not be reached; nothing was started or ended by it.
 */
final class HostStartRefused extends RuntimeException
{
    public static function because(string $reason): self
    {
        return new self(sprintf('The protected host refused: %s.', $reason));
    }

    public static function unreachable(string $socket, Throwable|null $cause = null): self
    {
        return new self(sprintf('The protected host at %s could not be reached.', $socket), previous: $cause);
    }
}
