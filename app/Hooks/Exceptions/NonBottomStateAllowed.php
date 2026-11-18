<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class NonBottomStateAllowed extends LogicException
{
    public static function for(string $stateType, string $hookMethod): self
    {
        return new self("The state {$stateType} allowed {$hookMethod}; only the bottom state may allow, others delegate.");
    }
}
