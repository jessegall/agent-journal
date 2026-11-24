<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class DriverTypeAmbiguous extends RuntimeException
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
