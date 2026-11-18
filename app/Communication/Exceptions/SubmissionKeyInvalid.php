<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A submission key that is not a UUID.
 */
final class SubmissionKeyInvalid extends RuntimeException implements CommandRefusal
{
    public static function forKey(string $key): self
    {
        return new self("A submission key is a UUID, not {$key}.");
    }
}
