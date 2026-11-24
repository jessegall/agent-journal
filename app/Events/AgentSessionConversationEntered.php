<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session entered its driver's conversation.
 */
final readonly class AgentSessionConversationEntered extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
    ) {}
}
