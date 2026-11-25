<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime was asked to stop.
 */
final readonly class AgentRuntimeStopRequested implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
