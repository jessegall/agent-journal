<?php

declare(strict_types=1);

namespace App\Events;

/**
 * An agent was retired for good: it takes no further job and resumes no session.
 */
final readonly class AgentRetired extends SessionEvent
{
    public function __construct(
        public string $agentId,
    ) {}
}
