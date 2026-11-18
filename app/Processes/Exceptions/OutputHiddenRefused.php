<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Values\OutputVerdict;
use RuntimeException;

/**
 * A command line would hide the output of a check or build, so nothing starts.
 */
final class OutputHiddenRefused extends RuntimeException
{
    public static function by(OutputVerdict $verdict): self
    {
        return new self(OutputVerdict::CODE.': '.implode(' ', $verdict->reasons()));
    }
}
