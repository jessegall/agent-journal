<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime's process exited and the runtime is stopped.
 */
final readonly class AgentRuntimeClosed extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
