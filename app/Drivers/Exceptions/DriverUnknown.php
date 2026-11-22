<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use RuntimeException;

final class DriverUnknown extends RuntimeException
{
    public static function for(string $key): self
    {
        return new self(sprintf('No driver is registered under the key "%s".', $key));
    }
}
