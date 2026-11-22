<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * A request key that is not 1 to 64 letters, digits or hyphens; nothing is sent under it.
 */
final class CallKeyInvalid extends InvalidArgumentException
{
    public static function for(string $key): self
    {
        return new self("The request key '{$key}' is not 1 to 64 letters, digits or hyphens.");
    }
}
