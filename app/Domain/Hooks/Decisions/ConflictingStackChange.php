<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

use LogicException;

final class ConflictingStackChange extends LogicException
{
    public static function forChange(ChangeKind $change): self
    {
        return new self("A decision makes one stack change; it already makes {$change->value}.");
    }
}
