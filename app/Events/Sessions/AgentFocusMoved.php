<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Work\AgentFocusEvent;

/**
 * An agent's focus moved to the record named.
 */
final readonly class AgentFocusMoved implements AgentFocusEvent, SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $focusedType,
        public string $focusedId,
    ) {}
}
