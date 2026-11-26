<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\Work\AgentFocusEvent;

/**
 * An agent's focus on the record named was taken away.
 */
final readonly class AgentFocusCleared implements AgentFocusEvent, SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $focusedType,
        public string $focusedId,
    ) {}
}
