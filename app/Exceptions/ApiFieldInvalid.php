<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * A signed call field held a line break, which could make one envelope read as another.
 */
final class ApiFieldInvalid extends InvalidArgumentException
{
    public static function lineBreak(): self
    {
        return new self('A signed call field may not hold a line break.');
    }
}
