<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Sessions\Contracts\ProfileRunEvent;

/**
 * A profile's script run stopped at a line to wait for a step.
 */
final readonly class ProfileRunSuspended implements AccountEvent, ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public int $line,
    ) {}
}
