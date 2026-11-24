<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\AgentFocusEvent;

/**
 * An agent's focus on the record named was taken away.
 */
final readonly class AgentFocusCleared extends SessionEvent implements AgentFocusEvent
{
    public function __construct(
        public string $agentId,
        public string $focusedType,
        public string $focusedId,
    ) {}
}
