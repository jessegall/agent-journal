<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

final class ProfileKeyInvalid extends InvalidArgumentException
{
    public static function for(string $text): self
    {
        return new self(
            sprintf(
                'A profile key is 1 to 64 lowercase letters and digits in words joined by single hyphens, such as journal-reviewer; "%s" is not.',
                $text,
            ),
        );
    }
}
