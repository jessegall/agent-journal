<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use LogicException;

final class InvalidHookAnswer extends LogicException
{
    public static function for(string $method, string $answerType): self
    {
        return new self("The hook {$method} cannot take the answer {$answerType}.");
    }
}
