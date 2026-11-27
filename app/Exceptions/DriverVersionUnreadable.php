<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A driver's VERSION file names no version the journal can pin, so no start of it may run: the file is missing, or
 * holds something else than one major.minor.patch version.
 */
final class DriverVersionUnreadable extends RuntimeException
{
    public static function missing(string $file): self
    {
        return new self("The driver version file {$file} is missing.");
    }

    public static function invalid(string $file, string $read): self
    {
        return new self("The driver version file {$file} holds \"{$read}\", not one version such as 1.2.3.");
    }
}
