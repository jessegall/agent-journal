<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A scenario has no recording for the pinned build, or nothing to record it from, so it is recorded first.
 */
final class RecordingMissing extends RuntimeException
{
    public static function of(string $scenario, string $missing): self
    {
        return new self("The scenario {$scenario} has no {$missing}: record it with scripts/record-scenarios.sh.");
    }
}
