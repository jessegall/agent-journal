<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A comment's quote that is not the text of its revision at the place it names.
 */
final class AnchorMismatch extends RuntimeException implements CommandRefusal
{
    public static function forRevision(int $revision, int $firstLine, int $lastLine): self
    {
        return new self("The quote is not the text of revision {$revision} at lines {$firstLine} to {$lastLine}; select the text again on the revision you are reading.");
    }
}
