<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class InvalidObservationAnswer extends LogicException
{
    public static function forAnswer(string $answerKind): self
    {
        return new self("The answer {$answerKind} has no reply to a hook that only reports or a prompt.");
    }
}
