<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

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

    public static function forValue(string $field, string $hookField): self
    {
        return new self("The hook payload's {$field} value {$hookField} cannot be read.");
    }
}
