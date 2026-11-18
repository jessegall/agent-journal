<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class StackTransactionRequired extends LogicException
{
    public static function forTarget(string $target): self
    {
        return new self("The stack of {$target} changes only inside a stack transaction.");
    }

    public static function withoutLimits(): self
    {
        return new self('This transaction has no lock time limit; open it through StackTransaction so a stack operation cannot wait forever.');
    }
}
