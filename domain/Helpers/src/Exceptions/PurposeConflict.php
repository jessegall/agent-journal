<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * A helper job names more than one of a subject, a purpose or a purpose of its own.
 */
final class PurposeConflict extends InvalidArgumentException implements CommandRefusal
{
    public static function forJob(): self
    {
        return new self('Name only one of a subject record, an existing purpose or a new purpose in words.');
    }
}
