<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;

/**
 * A folder to list or walk that does not exist, or that is a file.
 */
final class FolderMissing extends RuntimeException
{
    public static function at(FilePath $folder): self
    {
        return new self("No folder is at {$folder->label()}.");
    }
}
