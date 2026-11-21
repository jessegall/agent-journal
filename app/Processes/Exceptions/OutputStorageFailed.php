<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A piece of output could not be stored whole, for a full disk or a failed write; the run must stop with its capture
 * incomplete, never go on with bytes missing.
 */
final class OutputStorageFailed extends RuntimeException
{
    public static function at(string $path, int $written, int $wanted, Throwable|null $cause = null): self
    {
        return new self(
            "Output storage failed at {$path}: {$written} of {$wanted} bytes were written.",
            previous: $cause,
        );
    }
}
