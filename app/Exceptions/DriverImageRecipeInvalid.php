<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A driver's image folder holds a file no recipe may carry: a link, or a path that is absolute, climbs out of the
 * folder or is longer than a tar entry's name holds. Naming the path tells the developer which file to change.
 */
final class DriverImageRecipeInvalid extends RuntimeException
{
    public static function path(string $path): self
    {
        return new self("The driver image recipe cannot carry the path \"{$path}\": it must be a plain relative path "
            .'inside the folder, at most 100 bytes long.');
    }

    public static function link(string $path): self
    {
        return new self("The driver image folder holds the link {$path}; a recipe carries regular files only.");
    }
}
