<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A submission key sent again with a different message.
 */
final class SubmissionKeyReused extends RuntimeException implements CommandRefusal
{
    public static function forKey(string $key): self
    {
        return new self("Submission key {$key} was already used for a different message; send a new key.");
    }
}
