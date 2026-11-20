<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;

/**
 * A file inside its place that the journal's process may not open.
 */
final class FileUnreadable extends RuntimeException
{
    public static function at(FilePath $file): self
    {
        return new self("The file at {$file->label()} cannot be opened.");
    }
}
