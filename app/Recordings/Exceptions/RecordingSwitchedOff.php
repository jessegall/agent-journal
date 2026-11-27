<?php

declare(strict_types=1);

namespace App\Recordings\Exceptions;

use RuntimeException;

/**
 * A scenario is played for its recording while recording is off, so nothing would be kept.
 */
final class RecordingSwitchedOff extends RuntimeException
{
    public static function forScenario(string $scenario): self
    {
        return new self("Recording is off, so {$scenario} is not played: AGENTS_RECORDING=true turns it on.");
    }
}
