<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * An agent made a session its current runtime under a new generation, fencing every earlier one.
 */
final readonly class AgentRuntimeAdopted extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public int $runtimeGeneration,
    ) {}
}
