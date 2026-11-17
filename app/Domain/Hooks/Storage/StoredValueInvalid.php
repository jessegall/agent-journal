<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

use Throwable;
use UnexpectedValueException;

/**
 * A stored Hooks value that cannot be read back: broken JSON, a missing field, or a version this code does not know.
 */
final class StoredValueInvalid extends UnexpectedValueException
{
    public static function forColumn(string $column, Throwable $cause): self
    {
        return new self("The stored {$column} cannot be read: {$cause->getMessage()}", previous: $cause);
    }

    public static function forVersion(string $column, int $version): self
    {
        return new self("The stored {$column} is in version {$version}, which this code cannot read.");
    }
}
