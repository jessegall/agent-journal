<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Inputs\HookInput;
use LogicException;

final class ActivityAllowed extends LogicException
{
    public static function for(Frame $frame, HookInput $input): self
    {
        return new self("The state {$frame->typeKey()} allowed {$input->methodName()}; only the bottom state may allow, others delegate.");
    }
}
