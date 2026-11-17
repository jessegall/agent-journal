<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class CoveredStatePushed extends LogicException
{
    public static function for(string $stateType): self
    {
        return new self("The state {$stateType} is covered by another state and cannot push a state over it.");
    }
}
