<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A folder tree to remove that goes deeper than the depth the call allowed; nothing of it was removed.
 */
final class FolderTooDeep extends RuntimeException
{
    public static function at(string $path, int $levels): self
    {
        return new self("The folder {$path} goes deeper than {$levels} levels, so nothing of it was removed.");
    }
}
