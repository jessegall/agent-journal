<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use App\Support\Recordings\Enums\StaleReason;
use RuntimeException;

/**
 * A scenario's recording no longer stands for the code as it is, so it is recorded again.
 */
final class RecordingStale extends RuntimeException
{
    public static function of(string $scenario, StaleReason $reason): self
    {
        $again = 'Record it again with scripts/record-scenarios.sh.';

        return new self("The recording of {$scenario} is stale: {$reason->value}. {$again}");
    }
}
