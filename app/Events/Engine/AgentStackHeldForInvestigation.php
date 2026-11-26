<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Engine\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack was held so its fault can be looked into.
 */
final readonly class AgentStackHeldForInvestigation implements AgentStackEvent, EngineEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
