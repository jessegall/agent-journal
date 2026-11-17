<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

use LogicException;

final class NoRefusalReason extends LogicException
{
    public static function forAnswer(AnswerKind $kind): self
    {
        return new self("Only a denial or a held stop carries a reason; this answer is {$kind->value}.");
    }
}
