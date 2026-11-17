<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class StateTypesFrozen extends LogicException
{
    public static function forKey(string $typeKey): self
    {
        return new self("The state type {$typeKey} came after the state types were complete; register it from a StateTypesRequested listener.");
    }
}
