<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A signed call speaks a protocol version this journal does not read, so its client must be upgraded.
 */
final class CallProtocolUnsupported extends RuntimeException
{
    public static function version(string $version): self
    {
        return new self(
            "The call speaks signed protocol {$version}; this journal reads protocol 2 only, so upgrade the client.",
        );
    }
}
