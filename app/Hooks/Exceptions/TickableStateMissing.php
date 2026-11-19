<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class TickableStateMissing extends LogicException
{
    public static function forType(string $typeKey, string $stateClass): self
    {
        return new self(
            "The state type {$typeKey} is marked as ticking, but its loader built a {$stateClass}, which is no TickableState.",
        );
    }
}
