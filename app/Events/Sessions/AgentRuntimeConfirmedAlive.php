<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime's host confirmed it is still alive.
 */
final readonly class AgentRuntimeConfirmedAlive extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
