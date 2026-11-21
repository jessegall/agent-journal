<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;

/**
 * A create-only write to a path that already holds a file, which is left untouched.
 */
final class FileExists extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("A file is already at {$path}; it was left as it is.");
    }
}
