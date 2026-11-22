<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A write that failed, as on a full disk or a folder the process may not write; the old file is left as it was.
 */
final class FileUnwritable extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("The file at {$path} could not be written; the old file, if any, is unchanged.");
    }
}
