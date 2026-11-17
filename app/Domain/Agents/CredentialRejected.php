<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use RuntimeException;

/**
 * A request whose launch credential is missing, unknown, revoked or belongs to an ended session.
 */
final class CredentialRejected extends RuntimeException
{
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
}
