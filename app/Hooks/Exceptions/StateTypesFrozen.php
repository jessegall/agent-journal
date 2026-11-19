<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class StateTypesFrozen extends LogicException
{
    public static function forKey(string $typeKey): self
    {
        return new self(
            sprintf(
                'The state type %s came after the state types were complete; register it from a StateTypesRequested listener.',
                $typeKey,
            ),
        );
    }
}
