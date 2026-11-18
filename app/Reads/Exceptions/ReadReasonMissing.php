<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A read of every row named no reason.
 */
final class ReadReasonMissing extends RuntimeException
{
    public static function create(): self
    {
        return new self('readAll() needs the reason every row is read, such as \'the plan\'s complete progress\'.');
    }
}
