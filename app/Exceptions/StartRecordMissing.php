<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A start request that does not exist or that belongs to another agent; both answer alike.
 */
final class StartRecordMissing extends RuntimeException implements CommandRefusal
{
    public static function forRequest(string $requestId): self
    {
        return new self("No start request {$requestId} is yours.");
    }
}
