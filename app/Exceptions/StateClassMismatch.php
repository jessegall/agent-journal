<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class StateClassMismatch extends LogicException
{
    public static function for(string $typeKey, string $declaredClass, string $actualClass): self
    {
        return new self("State type {$typeKey} declares {$declaredClass} and loaded {$actualClass}.");
    }
}
