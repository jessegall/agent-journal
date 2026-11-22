<?php

declare(strict_types=1);

namespace App\Exceptions;

use UnexpectedValueException;

final class StateSchemaUnknown extends UnexpectedValueException
{
    public static function for(string $frame, int $version): self
    {
        return new self("{$frame}; this type reads version {$version}.");
    }
}
