<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * An agent made a session its current runtime under a new generation, fencing every earlier one.
 */
final readonly class AgentRuntimeAdopted implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public int $runtimeGeneration,
    ) {}
}
