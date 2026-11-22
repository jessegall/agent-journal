<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * A helper job names none of a subject, a purpose or a purpose of its own.
 */
final class PurposeRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forJob(): self
    {
        return new self('Name what the job is for: a subject record, an existing purpose, or a new purpose in words.');
    }
}
