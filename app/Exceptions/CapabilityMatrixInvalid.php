<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A checked-in capability matrix that cannot be read: a broken file, or a row with a field missing or unknown.
 */
final class CapabilityMatrixInvalid extends RuntimeException
{
    public static function unreadable(string $path, Throwable $previous): self
    {
        return new self("The capability matrix {$path} cannot be read.", 0, $previous);
    }

    public static function withoutRows(string $path): self
    {
        return new self("The capability matrix {$path} has no rows list.");
    }

    public static function row(string $path, int $row, string $field): self
    {
        return new self("Row {$row} of the capability matrix {$path} has no valid {$field}.");
    }
}
