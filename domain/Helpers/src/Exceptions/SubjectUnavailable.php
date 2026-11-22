<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * The subject or purpose a helper job names is missing or not visible; both answer alike.
 */
final class SubjectUnavailable extends InvalidArgumentException implements CommandRefusal
{
    public static function forJob(): self
    {
        return new self('That subject or purpose is not available to you.');
    }
}
