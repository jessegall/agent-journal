<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class ConflictingStackChange extends LogicException
{
    public static function forChange(string $change): self
    {
        return new self("A decision makes one stack change; it already makes {$change}.");
    }
}
