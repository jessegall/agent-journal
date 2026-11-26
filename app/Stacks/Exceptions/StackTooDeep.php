<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use LogicException;

/**
 * A stack change that would leave more frames on a stack than a stack may hold.
 */
final class StackTooDeep extends LogicException
{
    public static function for(string $target, int $deepest): self
    {
        return new self("The stack of {$target} would hold more than {$deepest} frames, ready included.");
    }
}
