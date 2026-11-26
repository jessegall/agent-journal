<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Exceptions;

use LogicException;

/**
 * A substitution was read from a queue that had found none.
 */
final class NoSubstitutionFound extends LogicException
{
    public static function inQueue(): self
    {
        return new self('A substitution was read from a word queue that found none.');
    }
}
