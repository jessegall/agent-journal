<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A request whose launch credential is missing, unknown, revoked, or belongs to an ended session or a retired agent.
 */
final class CredentialRejected extends RuntimeException
{
    /**
     * The call claims another profile than the one its launch was pinned to, or that profile is no longer admitted;
     * the reply is the same as for any rejected credential, so it does not tell whether the profile exists.
     */
    public static function profileMismatched(): self
    {
        return new self('The credential is not valid for this call.');
    }

    public static function missing(): self
    {
        return new self('The request carries no launch credential.');
    }

    public static function unknown(): self
    {
        return new self('The launch credential is not known.');
    }

    public static function revoked(): self
    {
        return new self('The launch credential was revoked.');
    }

    public static function sessionEnded(): self
    {
        return new self('The session of this launch credential has ended.');
    }

    public static function agentRetired(): self
    {
        return new self('The agent of this launch credential is retired.');
    }
}
