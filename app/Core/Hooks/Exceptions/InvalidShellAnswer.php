<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class InvalidShellAnswer extends LogicException
{
    public static function forAnswer(string $answerType): self
    {
        return new self("The answer {$answerType} has no reply to a shell command.");
    }
}
