<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;
use App\Sessions\Contracts\SessionFact;

/**
 * A runtime was asked to stop.
 */
final readonly class AgentRuntimeStopRequested implements AgentRuntimeEvent, SessionEvent, SessionFact
{
    public function __construct(
        public string $runtimeId,
        public string $sessionId,
    ) {}
}
