<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session entered its driver's conversation.
 */
final readonly class AgentSessionConversationEntered implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
