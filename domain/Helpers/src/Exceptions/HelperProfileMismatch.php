<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A send to a helper of another profile than the work names; the helper is never given another profile.
 */
final class HelperProfileMismatch extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(string $identityId, string $profileKey): self
    {
        return new self(sprintf(
            'Helper %s uses profile %s. Start a helper with the profile required for this work.',
            $identityId,
            $profileKey,
        ));
    }
}
