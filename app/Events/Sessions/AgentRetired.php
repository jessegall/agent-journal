<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * An agent was retired for good: it takes no further job and resumes no session.
 */
final readonly class AgentRetired implements SessionEvent
{
    public function __construct(
        public string $agentId,
    ) {}
}
