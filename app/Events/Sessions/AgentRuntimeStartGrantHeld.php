<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime holds a start grant for its host to claim.
 */
final readonly class AgentRuntimeStartGrantHeld implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
