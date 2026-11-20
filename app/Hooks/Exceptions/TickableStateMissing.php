<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class TickableStateMissing extends LogicException
{
    public static function forType(string $typeKey, string $class): self
    {
        return new self(
            sprintf(
                'The state type %s is marked as ticking, but its loader built a %s, which is no TickableState.',
                $typeKey,
                $class,
            ),
        );
    }
}
