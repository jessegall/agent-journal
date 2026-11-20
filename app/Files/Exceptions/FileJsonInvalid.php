<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A file read as JSON that holds no JSON object or list.
 */
final class FileJsonInvalid extends RuntimeException
{
    public static function at(string $path, string $error, Throwable|null $previous = null): self
    {
        return new self("{$path} holds no valid JSON object or list: {$error}.", 0, $previous);
    }
}
