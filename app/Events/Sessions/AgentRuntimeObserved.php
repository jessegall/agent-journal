<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Processes\Enums\RuntimeActivity;
use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * A runtime's host reported what the runtime is doing, at the process generation it reports.
 */
final readonly class AgentRuntimeObserved implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
        public RuntimeActivity $activity,
        public int $processGeneration,
    ) {}
}
