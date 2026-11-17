<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use LogicException;

final class NoReplacementLine extends LogicException
{
    public static function forAnswer(AnswerKind $kind): self
    {
        return new self("Only a rewrite carries a replacement line; this answer is {$kind->value}.");
    }
}
