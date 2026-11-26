<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use RuntimeException;

/**
 * A hook call issued outside the retry window, so it can be neither a new call nor a retry of an old one.
 */
final class HookIdentityExpired extends RuntimeException
{
    public static function forCall(string $callId, int $windowSeconds): self
    {
        return new self(
            "The hook call {$callId} was issued more than {$windowSeconds} seconds from now and is refused.",
        );
    }
}
