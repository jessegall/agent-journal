<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Contracts\Work\AgentStackEvent;

/**
 * An agent's stack was started for a session with its first frames.
 */
final readonly class AgentStackStarted extends EngineEvent implements AgentStackEvent
{
    public function __construct(
        public string $stackId,
    ) {}
}
