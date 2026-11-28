<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/** The agent has a new selection for its next start. */
final readonly class AgentStartChoiceMade implements SessionEvent
{
    public function __construct(public string $agentId) {}
}
