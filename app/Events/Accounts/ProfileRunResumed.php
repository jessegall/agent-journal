<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Sessions\ProfileRunEvent;

/**
 * A profile's script run went on after the step it waited for.
 */
final readonly class ProfileRunResumed implements AccountEvent, ProfileRunEvent
{
    public function __construct(
        public string $runId,
    ) {}
}
