<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start request id sent again with different contents; the first start under that id stands.
 */
final class StartRequestConflict extends RuntimeException implements CommandRefusal
{
    public static function forRequest(string $requestId): self
    {
        return new self(
            sprintf(
                'Start request %s was already sent with different contents. Send a new request id for a different start.',
                $requestId,
            ),
        );
    }
}
