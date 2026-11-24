<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack saved its frames.
 */
final readonly class AgentStackFramesSaved extends EngineEvent implements AgentStackEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
