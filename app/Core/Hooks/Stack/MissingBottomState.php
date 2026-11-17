<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Inputs\HookInput;
use LogicException;

final class MissingBottomState extends LogicException
{
    public static function for(HookInput $input): self
    {
        return new self("The stack has no bottom state to answer {$input->methodName()}.");
    }
}
