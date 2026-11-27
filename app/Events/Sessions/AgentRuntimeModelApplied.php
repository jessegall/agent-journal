<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * A runtime's driver applied a model, which every later start of the runtime runs at.
 */
final readonly class AgentRuntimeModelApplied implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
