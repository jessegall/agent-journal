<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session took the driver selection of a request.
 */
final readonly class AgentSessionSelectionUsed implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $requestId,
    ) {}
}
