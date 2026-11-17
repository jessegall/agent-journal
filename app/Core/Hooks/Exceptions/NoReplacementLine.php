<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class NoReplacementLine extends LogicException
{
    public static function forAnswer(string $answerType): self
    {
        return new self("Only a rewrite carries a replacement line; this answer is {$answerType}.");
    }
}
