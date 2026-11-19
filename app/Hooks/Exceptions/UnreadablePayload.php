<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use UnexpectedValueException;

/**
 * A hook payload without a field its event needs, or with a value no adapter can read; the call is refused, never
 * guessed.
 */
final class UnreadablePayload extends UnexpectedValueException
{
    public static function missing(string $field): self
    {
        return new self("The hook payload has no {$field}.");
    }

    public static function forValue(string $field, string $value): self
    {
        return new self("The hook payload's {$field} value {$value} cannot be read.");
    }
}
