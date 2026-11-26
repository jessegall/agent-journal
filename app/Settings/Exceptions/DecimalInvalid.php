<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use InvalidArgumentException;
use Throwable;

/**
 * Text that is not an exact decimal this application accepts; the message never repeats the text.
 */
final class DecimalInvalid extends InvalidArgumentException
{
    public static function notPlain(): self
    {
        return new self('A decimal is written as an optional minus, digits, and optionally a point followed by digits: no plus, spaces, exponent or words.');
    }

    public static function tooManyPlaces(int $scale, Throwable|null $previous = null): self
    {
        return new self("The decimal has more than {$scale} fractional digits.", previous: $previous);
    }

    public static function tooManyDigits(int $precision): self
    {
        return new self("The decimal has more than {$precision} digits.");
    }

    public static function outOfBounds(): self
    {
        return new self('The decimal lies outside the bounds of its setting.');
    }
}
