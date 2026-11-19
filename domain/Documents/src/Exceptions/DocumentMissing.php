<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A document number that no readable document has. A number outside the reader's scope answers the same, so it reveals
 * nothing.
 */
final class DocumentMissing extends RuntimeException implements CommandRefusal
{
    public static function numbered(int $number): self
    {
        return new self("There is no doc {$number} to read.");
    }
}
