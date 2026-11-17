<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Decisions\AnswerKind;
use LogicException;

final class InvalidObservationAnswer extends LogicException
{
    public static function forAnswer(AnswerKind $kind): self
    {
        return new self("The answer {$kind->value} has no reply to a hook that only reports or a prompt.");
    }
}
