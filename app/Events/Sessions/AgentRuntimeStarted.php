<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime began its first process generation.
 */
final readonly class AgentRuntimeStarted extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
