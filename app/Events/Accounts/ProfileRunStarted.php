<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Sessions\ProfileRunEvent;

/**
 * A profile's script run started on the process generation given.
 */
final readonly class ProfileRunStarted implements AccountEvent, ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public int $generation,
    ) {}
}
