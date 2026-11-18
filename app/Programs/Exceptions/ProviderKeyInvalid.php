<?php

declare(strict_types=1);

namespace App\Programs\Exceptions;

use InvalidArgumentException;

final class ProviderKeyInvalid extends InvalidArgumentException
{
    public static function for(string $text): self
    {
        return new self("A provider key is 1 to 64 lowercase letters and digits in words joined by single hyphens; \"{$text}\" is not.");
    }
}
