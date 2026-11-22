<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A request whose start token is missing, unknown, revoked, or belongs to an ended session or a retired agent.
 */
final class CredentialRejected extends RuntimeException
{
    /**
     * The call claims another profile than the one its start was pinned to, or that profile is no longer admitted;
     * the reply is the same as for any rejected credential, so it does not tell whether the profile exists.
     */
    public static function profileMismatched(Throwable|null $previous = null): self
    {
        return new self('The credential is not valid for this call.', previous: $previous);
    }

    public static function missing(): self
    {
        return new self('The request carries no start token.');
    }

    public static function unknown(): self
    {
        return new self('The start token is not known.');
    }

    public static function revoked(): self
    {
        return new self('The start token was revoked.');
    }

    public static function sessionEnded(): self
    {
        return new self('The session of this start token has ended.');
    }

    public static function fenced(): self
    {
        return new self('This runtime was replaced by a newer one of the same agent; use the newer credential.');
    }

    public static function agentRetired(): self
    {
        return new self('The agent of this start token is retired.');
    }
}
