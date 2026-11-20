<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;

/**
 * A path whose links lead round in a loop, so it names no file.
 */
final class LinkLoop extends RuntimeException
{
    public static function at(FilePath $file): self
    {
        return new self("{$file->label()} goes through links that lead round in a loop.");
    }
}
