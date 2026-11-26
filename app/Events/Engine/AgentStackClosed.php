<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Engine\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack was closed.
 */
final readonly class AgentStackClosed implements AgentStackEvent, EngineEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
