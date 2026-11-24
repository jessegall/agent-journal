<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session was handed a generation of skills.
 */
final readonly class AgentSessionSkillsGenerated extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $generationId,
    ) {}
}
