<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A helper start from a profile that coordinates the work, which only a main start may use.
 */
final class HelperProfileTypeConflict extends RuntimeException implements CommandRefusal
{
    public static function forProfile(string $profileKey): self
    {
        return new self(sprintf('Profile %s starts main agents, never helpers. Choose a helper profile.', $profileKey));
    }
}
