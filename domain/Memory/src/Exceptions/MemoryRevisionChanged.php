<?php

declare(strict_types=1);

namespace Domain\Memory\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * An edit of a memory that changed since the caller read it; the newer text stays.
 */
final class MemoryRevisionChanged extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $memoryId, int $expected, int $current): self
    {
        return new self("Memory {$memoryId} is at revision {$current}, not {$expected}: read it again before editing.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
