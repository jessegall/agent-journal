<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class BottomStateCannotFinish extends LogicException
{
    public static function for(string $stateType): self
    {
        return new self("The bottom state {$stateType} cannot finish or leave the stack.");
    }
}
