<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime began its first process generation.
 */
final readonly class AgentRuntimeBegun extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
