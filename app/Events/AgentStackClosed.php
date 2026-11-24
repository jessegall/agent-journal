<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack was closed.
 */
final readonly class AgentStackClosed extends EngineEvent implements AgentStackEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
