<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use App\Drivers\Values\DriverKey;
use InvalidArgumentException;

final class DriverKeyInvalid extends InvalidArgumentException
{
    public static function for(string $text): self
    {
        return new self(sprintf(
            'A driver key is up to %d lowercase letters and digits in words joined by single hyphens, with an optional'
            .' vendor before one slash; "%s" is not.',
            DriverKey::CHARACTER_LIMIT,
            $text,
        ));
    }
}
