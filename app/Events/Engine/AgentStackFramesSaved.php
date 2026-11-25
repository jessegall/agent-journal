<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack saved its frames.
 */
final readonly class AgentStackFramesSaved implements AgentStackEvent, EngineEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
