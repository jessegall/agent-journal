<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A listener file whose class cannot be read from its path: it lies under no PSR-4 root of composer.json, or it
 * does not declare the class its path names.
 */
final class FileOutsideAutoload extends LogicException
{
    public static function for(string $path): self
    {
        return new self("{$path} lies under no PSR-4 root of composer.json; add its folder to the autoload section.");
    }

    public static function missingClass(string $path, string $class): self
    {
        return new self("{$path} should declare {$class}, the class its path names; rename the file or the class.");
    }
}
