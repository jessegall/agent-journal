<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class HookProtocolUnknown extends RuntimeException
{
    public static function for(string $protocol): self
    {
        return new self("No hook adapter reads the native hook protocol \"{$protocol}\".");
    }
}
