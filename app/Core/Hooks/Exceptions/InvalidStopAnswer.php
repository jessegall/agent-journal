<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class InvalidStopAnswer extends LogicException
{
    public static function forAnswer(string $answerKind): self
    {
        return new self("The answer {$answerKind} has no reply to a stop.");
    }
}
