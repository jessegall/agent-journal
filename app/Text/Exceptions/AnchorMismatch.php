<?php

declare(strict_types=1);

namespace App\Text\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A quote that is not the text of its version at the place it names.
 */
final class AnchorMismatch extends RuntimeException implements CommandRefusal
{
    public static function forRevision(int $revision, int $firstLine, int $lastLine): self
    {
        return new self(
            "The quote is not the text of revision {$revision} at lines {$firstLine} to {$lastLine}; select the text again on the revision you are reading.",
        );
    }

    public static function inVersion(string $label, int $firstLine, int $lastLine): self
    {
        return new self(
            "The quote is not the text of {$label} at lines {$firstLine} to {$lastLine}; select the text again on the version you are reading.",
        );
    }
}
