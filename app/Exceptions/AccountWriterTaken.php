<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A start refused because its account already has a runtime that must run alone on it, or because the start itself
 * must run alone and the account is in use: two clients would each refresh the same sign-in.
 */
final class AccountWriterTaken extends RuntimeException
{
    private function __construct(string $message, public readonly string $ownerSessionId)
    {
        parent::__construct($message);
    }

    public static function heldBy(string $ownerSessionId): self
    {
        return new self(sprintf(
            'Session %s runs alone on this account, as it refreshes the sign-in itself. Stop that session, or start this one on another account.',
            $ownerSessionId,
        ), $ownerSessionId);
    }

    public static function inUseBy(string $ownerSessionId): self
    {
        return new self(sprintf(
            'This driver runs alone on its account, as it refreshes the sign-in itself, and session %s uses the account. Stop that session, or choose another account.',
            $ownerSessionId,
        ), $ownerSessionId);
    }
}
