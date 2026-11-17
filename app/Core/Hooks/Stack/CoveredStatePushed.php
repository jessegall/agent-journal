<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use LogicException;

final class CoveredStatePushed extends LogicException
{
    public static function for(Frame $frame): self
    {
        return new self("The state {$frame->typeKey()} is covered by another state and cannot push a state over it.");
    }
}
