<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;

/**
 * A path inside its place that names no file or folder.
 */
final class FileMissing extends RuntimeException
{
    public static function at(FilePath $file): self
    {
        return new self("No file is at {$file->label()}.");
    }
}
