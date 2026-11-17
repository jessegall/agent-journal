<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use UnexpectedValueException;

final class StateSchemaUnknown extends UnexpectedValueException
{
    public static function for(string $frame, int $knownVersion): self
    {
        return new self("{$frame}; this type reads version {$knownVersion}.");
    }
}
