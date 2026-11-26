<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A continuation that was valid but no longer is: it expired, or the record it reads changed revision.
 */
final class ContinuationStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @use ThrowsLater<ContinuationStale>
     */
    use ThrowsLater;

    public static function expired(): self
    {
        return new self('The continuation expired; start the read again from its first page.');
    }

    public static function revisionChanged(int $issued, int $current): self
    {
        return new self(
            sprintf(
                'The continuation reads revision %s, but the record is now at revision %s; start the read again.',
                $issued,
                $current,
            ),
        );
    }

    public static function textChanged(): self
    {
        return new self('The text changed. Start the read again from its first page.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StaleContinuation;
    }
}
