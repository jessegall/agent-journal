<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use RuntimeException;

final class DriverModeAmbiguous extends RuntimeException
{
    public static function for(string $family, string $mode, string $registered, string $refused): self
    {
        return new self(sprintf(
            'The %s family has a %s driver already (%s), so %s cannot take that mode as well.',
            $family,
            $mode,
            $registered,
            $refused,
        ));
    }
}
