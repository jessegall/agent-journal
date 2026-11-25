<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * An accepted helper job attached to the session its start opened, and runs.
 */
final readonly class HelperJobAttached implements HelperEvent, HelperJobEvent
{
    public function __construct(
        public string $jobId,
        public string $sessionId,
    ) {}
}
