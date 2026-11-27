<?php

declare(strict_types=1);

namespace App\Access\Exceptions;

use LogicException;

/**
 * The run id of a refused admission was asked for: a refusal queues no run, so its caller checks the decision first.
 */
final class AdmissionStartedNoRun extends LogicException
{
    public static function refused(): self
    {
        return new self('A refused admission queued no run.');
    }
}
