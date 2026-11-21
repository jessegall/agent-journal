<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use Throwable;
use RuntimeException;

/**
 * A start's output grant snapshot that is not one the journal sealed for it; the relay grants nothing from it.
 */
final class OutputGrantsInvalid extends RuntimeException
{
    public static function malformed(Throwable|null $cause = null): self
    {
        return new self('The output grant snapshot is not a sealed list of paths.', 0, $cause);
    }

    public static function unsealed(): self
    {
        return new self('The output grant snapshot was not sealed for this start and generation.');
    }
}
