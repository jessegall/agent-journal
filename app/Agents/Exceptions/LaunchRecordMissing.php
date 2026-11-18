<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A launch request that does not exist or that belongs to another agent; both answer alike.
 */
final class LaunchRecordMissing extends RuntimeException implements CommandRefusal
{
    public static function forRequest(string $requestId): self
    {
        return new self("No launch request {$requestId} is yours.");
    }
}
