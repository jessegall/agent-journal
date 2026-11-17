<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\HookInput;
use LogicException;

final class InvalidHookAnswer extends LogicException
{
    public static function for(HookInput $input, Decision $decision): self
    {
        return new self("The hook {$input->methodName()} cannot take the answer {$decision->answerKind()->value}.");
    }
}
