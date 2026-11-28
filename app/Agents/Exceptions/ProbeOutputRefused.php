<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A probe printed something before the answer it was run for, such as a line of the image's own start, so its answer
 * is not read at all: the start ends naming the line, never as an account that is not signed in.
 */
final class ProbeOutputRefused extends RuntimeException implements CommandRefusal
{
    public static function before(string $line): self
    {
        return new self("The sign-in probe printed \"{$line}\" before its answer, so its answer was not read.");
    }
}
