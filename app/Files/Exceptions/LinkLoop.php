<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;

/**
 * A path whose links lead round in a loop, so it names no file.
 */
final class LinkLoop extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("{$path} goes through links that lead round in a loop.");
    }
}
