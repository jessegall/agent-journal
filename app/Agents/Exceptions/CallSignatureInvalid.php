<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A call whose id, issue time or body does not match the signature made with its start token.
 */
final class CallSignatureInvalid extends RuntimeException
{
    public static function missing(string $header): self
    {
        return new self("The call carries no {$header} header.");
    }

    public static function mismatched(string $callId): self
    {
        return new self("The signature of call {$callId} does not match its method, target, id, issue time and body.");
    }
}
