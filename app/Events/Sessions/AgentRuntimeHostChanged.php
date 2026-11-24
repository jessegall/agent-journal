<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime moved to another host under a new process generation.
 */
final readonly class AgentRuntimeHostChanged extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
        public string $hostId,
        public int $processGeneration,
    ) {}
}
