<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use InvalidArgumentException;

final class DriverKeyInvalid extends InvalidArgumentException
{
    public static function for(string $text): self
    {
        return new self(
            sprintf(
                'A driver key is 1 to 64 lowercase letters and digits in words joined by single hyphens; "%s" is not.',
                $text,
            ),
        );
    }
}
