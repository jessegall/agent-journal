<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;

/**
 * A walk that reached a folder it had already entered, as a bind mount of a folder inside itself makes.
 */
final class FolderLoop extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("The walk reached {$path}, a folder it had already entered.");
    }
}
