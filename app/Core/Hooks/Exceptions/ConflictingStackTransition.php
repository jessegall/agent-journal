<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class ConflictingStackTransition extends LogicException
{
    public static function forTransition(string $transition): self
    {
        return new self("A decision makes one stack transition; it already makes {$transition}.");
    }
}
