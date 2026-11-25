<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime moved to another host under a new process generation.
 */
final readonly class AgentRuntimeHostChanged implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
        public string $hostId,
        public int $processGeneration,
    ) {}
}
