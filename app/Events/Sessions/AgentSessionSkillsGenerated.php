<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session was handed a generation of skills.
 */
final readonly class AgentSessionSkillsGenerated implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $generationId,
    ) {}
}
