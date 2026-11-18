<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use RuntimeException;

/**
 * A saved revision or report changed; what was written stays as written, and a change is a new revision or report.
 */
final class RecordImmutable extends RuntimeException
{
    public static function for(string $record): self
    {
        return new self("A saved {$record} does not change; write a new revision or a follow-up report instead.");
    }
}
