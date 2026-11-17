<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class ActivityAllowed extends LogicException
{
    public static function for(string $stateType, string $hookMethod): self
    {
        return new self("The state {$stateType} allowed {$hookMethod}; only the bottom state may allow, others delegate.");
    }
}
