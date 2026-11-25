<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime's host confirmed it is still alive.
 */
final readonly class AgentRuntimeConfirmedAlive implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
