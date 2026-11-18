<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A draft that cannot be opened: someone else holds this document's draft, or the editor holds a draft elsewhere.
 */
final class DraftHeld extends RuntimeException implements CommandRefusal
{
    public static function byOther(string $holder): self
    {
        return new self("{$holder} holds the draft of this document; try again once it is closed.");
    }

    public static function elsewhere(int $documentNumber): self
    {
        return new self("You hold the draft of doc {$documentNumber}; close it before opening another document.");
    }
}
