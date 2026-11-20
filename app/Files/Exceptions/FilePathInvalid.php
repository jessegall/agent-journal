<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use InvalidArgumentException;

/**
 * A path inside a place that could reach outside it: it climbs with '..', starts at the root, or holds a NUL byte.
 */
final class FilePathInvalid extends InvalidArgumentException
{
    public static function climbs(string $relative): self
    {
        return new self("The path {$relative} leaves its place: name a path inside the place, without '..' or a leading '/'.");
    }

    public static function recursivePattern(string $pattern): self
    {
        return new self("The pattern {$pattern} holds '**': name each folder level with its own '*', so its depth shows.");
    }

    public static function nulByte(): self
    {
        return new self('A file path holds a NUL byte: no file is named by one.');
    }
}
