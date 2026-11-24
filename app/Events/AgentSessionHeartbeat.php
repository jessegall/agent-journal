<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session's heartbeat was recorded.
 */
final readonly class AgentSessionHeartbeat extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
