<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class DriverRegisteredTwice extends RuntimeException
{
    public static function for(string $key): self
    {
        return new self(sprintf('A driver is registered under the key "%s" already.', $key));
    }
}
