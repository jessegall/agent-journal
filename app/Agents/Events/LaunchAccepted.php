<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A launch the journal accepted and committed: what the host's delivery hears, so no program starts inside the
 * transaction.
 */
final readonly class LaunchAccepted implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public string $sessionId,
    ) {}
}
