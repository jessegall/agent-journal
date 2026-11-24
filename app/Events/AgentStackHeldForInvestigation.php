<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack was held so its fault can be looked into.
 */
final readonly class AgentStackHeldForInvestigation extends EngineEvent implements AgentStackEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
