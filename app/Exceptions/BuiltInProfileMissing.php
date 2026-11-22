<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

final class BuiltInProfileMissing extends InvalidArgumentException
{
    public static function forKey(string $key): self
    {
        return new self("No built-in profile has the key {$key}.");
    }
}
