<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;

/**
 * A path inside its place that names no file or folder.
 */
final class FileMissing extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("No file is at {$path}.");
    }
}
