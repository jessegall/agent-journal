<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session ended.
 */
final readonly class AgentSessionEnded extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
