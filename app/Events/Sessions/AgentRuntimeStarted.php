<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * A runtime began its first process generation.
 */
final readonly class AgentRuntimeStarted implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
