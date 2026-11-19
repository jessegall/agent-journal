<?php

declare(strict_types=1);

namespace App\Numbers\Exceptions;

use InvalidArgumentException;

/**
 * Text that does not name a record the way people name one, such as 'plan 0' or 'task 1e3'.
 */
final class InvalidRecordReference extends InvalidArgumentException
{
    public static function number(string $text): self
    {
        return new self(
            "{$text} is no record number: write a positive whole number such as 12, without sign, leading zeros or "
                .'spaces.',
        );
    }

    public static function unreadable(string $text): self
    {
        return new self("{$text} names no record: write its type and number, such as plan 12.");
    }
}
