<?php

declare(strict_types=1);

namespace App\Text\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A place in a text that does not exist in the version it names.
 */
final class InvalidTextRange extends RuntimeException implements CommandRefusal
{
    public static function otherVersion(string $asked, string $read): self
    {
        return new self(
            sprintf(
                'The place names version %s, but version %s was read; select the text again on the version you are reading.',
                $asked,
                $read,
            ),
        );
    }

    public static function noSection(int $number): self
    {
        return new self("The text has no section {$number}.");
    }

    public static function badLines(int $first, int $last, int $lineCount): self
    {
        return new self(
            sprintf(
                'Lines %s to %s are not lines of this text, which has %s; give the first line first, both from 1.',
                $first,
                $last,
                $lineCount,
            ),
        );
    }

    public static function badQuoteLength(int $most): self
    {
        return new self("A quote is not empty and at most {$most} bytes long.");
    }

    public static function badOffsets(int $start, int $end): self
    {
        return new self("The quote's byte offsets {$start} to {$end} do not lie within its lines.");
    }

    public static function splitCharacter(): self
    {
        return new self('The quote starts or ends inside a character; select whole characters.');
    }
}
