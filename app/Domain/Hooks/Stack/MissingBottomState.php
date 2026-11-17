<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Inputs\HookInput;
use LogicException;

final class MissingBottomState extends LogicException
{
    public static function for(HookInput $input): self
    {
        return new self("The stack has no bottom state to answer {$input->methodName()}.");
    }
}
