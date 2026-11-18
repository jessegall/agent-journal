<?php

declare(strict_types=1);

namespace Domain\Memory\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A memory that does not exist or belongs to another actor; both answer alike.
 */
final class MemoryUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forId(string $memoryId): self
    {
        return new self("Memory {$memoryId} is not one of yours.");
    }
}
