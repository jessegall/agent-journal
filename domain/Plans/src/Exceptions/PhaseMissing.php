<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use RuntimeException;

/**
 * A plan has no phase with the number asked for.
 */
final class PhaseMissing extends RuntimeException
{
    public static function numbered(int $planNumber, int $phaseNumber): self
    {
        return new self("Plan {$planNumber} has no phase {$phaseNumber}.");
    }
}
