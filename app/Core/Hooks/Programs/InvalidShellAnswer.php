<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Decisions\AnswerKind;
use LogicException;

final class InvalidShellAnswer extends LogicException
{
    public static function forAnswer(AnswerKind $kind): self
    {
        return new self("The answer {$kind->value} has no reply to a shell command.");
    }
}
