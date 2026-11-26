<?php

declare(strict_types=1);

namespace App\Sessions\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A host asked for the account start of a session whose runtime is not assigned to it; nothing is claimed.
 */
final class StartClaimRefused extends RuntimeException implements CommandRefusal
{
    public static function onAnotherHost(string $sessionId, string $hostId): self
    {
        return new self(sprintf(
            'The start of session %s is not assigned to host %s, so it is not claimed.',
            $sessionId,
            $hostId,
        ));
    }

    public static function withoutRuntime(string $sessionId): self
    {
        return new self(sprintf('Session %s has no runtime, so its start is not claimed.', $sessionId));
    }
}
