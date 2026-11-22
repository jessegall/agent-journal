<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A settlement that may not happen: by an agent that did not create the record, on a record already settled for
 * another reason, or on a document someone is editing.
 */
final class SettlementDenied extends RuntimeException implements CommandRefusal
{
    public static function notCreator(): self
    {
        return new self('Only a user, or the agent that created this record, may settle it.');
    }

    public static function settledFor(string $reason): self
    {
        return new self("This record is already settled: {$reason}");
    }

    public static function beingEdited(int $documentNumber): self
    {
        return new self("doc {$documentNumber} has an open draft; close it before settling the document.");
    }
}
