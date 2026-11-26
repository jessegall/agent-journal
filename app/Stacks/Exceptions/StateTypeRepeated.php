<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use LogicException;

final class StateTypeRepeated extends LogicException
{
    public static function forKey(string $typeKey): self
    {
        return new self("The state type {$typeKey} is registered twice.");
    }
}
