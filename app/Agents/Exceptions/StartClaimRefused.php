<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A host asked for the account start of a session whose runtime is not assigned to it, or whose account is gone;
 * nothing is claimed.
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

    public static function withoutAccount(string $sessionId): self
    {
        return new self(sprintf('The account of session %s is gone, so its start is not claimed.', $sessionId));
    }
}
