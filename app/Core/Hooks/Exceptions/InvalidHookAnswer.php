<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class InvalidHookAnswer extends LogicException
{
    public static function for(string $hookMethod, string $answerType): self
    {
        return new self("The hook {$hookMethod} cannot take the answer {$answerType}.");
    }
}
