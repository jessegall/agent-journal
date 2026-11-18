<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A continuation that was valid but no longer is: it expired, or the record it reads changed revision.
 */
final class ContinuationStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function expired(): self
    {
        return new self('The continuation expired; start the read again from its first page.');
    }

    public static function revisionChanged(int $issued, int $current): self
    {
        return new self("The continuation reads revision {$issued}, but the record is now at revision {$current}; start the read again.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StaleContinuation;
    }
}
