<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Storage\StackTarget;
use LogicException;

final class StackTransactionRequired extends LogicException
{
    public static function forTarget(StackTarget $target): self
    {
        return new self("The stack of agent {$target->agentId}, session {$target->sessionId} changes only inside a stack transaction.");
    }

    public static function withoutLimits(): self
    {
        return new self('This transaction has no lock time limit; open it through StackTransaction so a stack operation cannot wait forever.');
    }
}
