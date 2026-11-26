<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use InvalidArgumentException;

final class ProviderKeyInvalid extends InvalidArgumentException
{
    public static function for(string $text): self
    {
        return new self(
            sprintf(
                'A provider key is 1 to 64 lowercase letters and digits in words joined by single hyphens; "%s" is not.',
                $text,
            ),
        );
    }
}
