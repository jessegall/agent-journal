<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * A helper start or send for a profile key with no activated profile; nothing is reserved or written.
 */
final class HelperProfilesUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forProfile(string $profileKey, Throwable $previous): self
    {
        return new self(sprintf(
            'Profile %s has no activated definition, so no helper was reserved or launched. Activate it first.',
            $profileKey,
        ), previous: $previous);
    }
}
