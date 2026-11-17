<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use LogicException;

final class BottomStateCannotFinish extends LogicException
{
    public static function for(Frame $frame): self
    {
        return new self("The bottom state {$frame->typeKey()} cannot finish or leave the stack.");
    }
}
