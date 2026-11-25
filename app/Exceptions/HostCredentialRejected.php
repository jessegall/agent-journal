<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A host call whose credential, signature, time or call id the journal does not accept.
 */
final class HostCredentialRejected extends RuntimeException
{
    /** @use ThrowsLater<HostCredentialRejected> */
    use ThrowsLater;

    public static function missing(): self
    {
        return new self('A host call needs its host credential as a bearer token.');
    }

    public static function unknown(): self
    {
        return new self('No enrolled host has this credential.');
    }

    public static function revoked(): self
    {
        return new self('This host credential was revoked.');
    }

    public static function stale(int $issuedAt): self
    {
        return new self("A host call issued at {$issuedAt} is outside the accepted time window.");
    }

    public static function replayed(string $callId): self
    {
        return new self("The host call {$callId} was already used.");
    }
}
