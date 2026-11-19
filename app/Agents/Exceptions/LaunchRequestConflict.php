<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A launch request id sent again with different contents; the first launch under that id stands.
 */
final class LaunchRequestConflict extends RuntimeException implements CommandRefusal
{
    public static function forRequest(string $requestId): self
    {
        return new self(
            "Launch request {$requestId} was already sent with different contents. Send a new request id for a different launch.",
        );
    }
}
