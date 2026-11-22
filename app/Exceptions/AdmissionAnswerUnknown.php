<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * The journal answered an admission fetch with a shape this client does not know.
 */
final class AdmissionAnswerUnknown extends LogicException
{
    public static function for(string $answer): self
    {
        return new self("An admission fetch answered {$answer}, which this client cannot start.");
    }
}
