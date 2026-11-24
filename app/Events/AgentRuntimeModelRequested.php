<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime was asked to run with another model.
 */
final readonly class AgentRuntimeModelRequested extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
        public string $model,
    ) {}
}
