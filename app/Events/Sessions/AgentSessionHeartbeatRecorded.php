<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session's heartbeat was recorded.
 */
final readonly class AgentSessionHeartbeatRecorded extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
