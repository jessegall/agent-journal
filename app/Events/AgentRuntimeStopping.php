<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime was asked to stop.
 */
final readonly class AgentRuntimeStopping extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
