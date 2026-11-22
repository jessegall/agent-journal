<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A file inside its place that the journal's process may not open.
 */
final class FileUnreadable extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("The file at {$path} cannot be opened.");
    }
}
