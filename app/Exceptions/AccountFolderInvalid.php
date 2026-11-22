<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * An account whose folder is not a plain id under the accounts root; its start is refused before any container.
 */
final class AccountFolderInvalid extends InvalidArgumentException
{
    public static function named(string $name): self
    {
        return new self("The account folder {$name} is not a plain id, so a container may not bind it.");
    }
}
