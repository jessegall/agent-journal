<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use RuntimeException;

final class DriverFamilyRegisteredTwice extends RuntimeException
{
    public static function for(string $key): self
    {
        return new self(sprintf('A driver family is registered under the key "%s" already.', $key));
    }
}
