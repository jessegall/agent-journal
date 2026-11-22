<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class InvalidObservationAnswer extends LogicException
{
    public static function forAnswer(string $answerType): self
    {
        return new self("The answer {$answerType} has no reply to a hook that only reports or a prompt.");
    }
}
