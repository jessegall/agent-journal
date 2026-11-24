<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Sessions\ProfileRunEvent;

/**
 * A profile's script run stopped at a line to wait for a step.
 */
final readonly class ProfileRunSuspended extends AccountEvent implements ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public int $line,
    ) {}
}
