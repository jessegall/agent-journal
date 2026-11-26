<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentSessionEvent;

/**
 * A session entered its driver's conversation.
 */
final readonly class AgentSessionConversationEntered implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
