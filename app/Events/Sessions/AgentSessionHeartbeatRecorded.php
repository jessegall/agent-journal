<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentSessionEvent;

/**
 * A session's heartbeat was recorded.
 */
final readonly class AgentSessionHeartbeatRecorded implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
