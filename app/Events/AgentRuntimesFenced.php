<?php

declare(strict_types=1);

namespace App\Events;

/**
 * Every runtime of an agent ended: no session stays current, so each of its credentials is refused.
 */
final readonly class AgentRuntimesFenced extends SessionEvent
{
    public function __construct(
        public string $agentId,
        public int $runtimeGeneration,
    ) {}
}
