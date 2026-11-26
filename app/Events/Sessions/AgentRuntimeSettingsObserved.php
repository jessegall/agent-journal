<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * A runtime's host reported the model and effort the runtime runs with.
 */
final readonly class AgentRuntimeSettingsObserved implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
