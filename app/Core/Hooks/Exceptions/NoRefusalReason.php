<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class NoRefusalReason extends LogicException
{
    public static function forAnswer(string $answerKind): self
    {
        return new self("Only a denial or a held stop carries a reason; this answer is {$answerKind}.");
    }
}
