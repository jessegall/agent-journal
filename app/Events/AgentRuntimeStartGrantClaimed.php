<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime's held start grant was claimed and cleared.
 */
final readonly class AgentRuntimeStartGrantClaimed extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
