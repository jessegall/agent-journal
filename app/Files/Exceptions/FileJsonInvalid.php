<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;
use Throwable;

/**
 * A file read as JSON that holds no JSON object or list.
 */
final class FileJsonInvalid extends RuntimeException
{
    public static function at(FilePath $file, string $error, Throwable|null $previous = null): self
    {
        return new self("{$file->label()} holds no valid JSON object or list: {$error}.", 0, $previous);
    }
}
