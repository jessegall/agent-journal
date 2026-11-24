<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;
use App\Enums\HoldReason;

/**
 * A runtime's hold changed: it is held for the reason given, or released when the reason is none.
 */
final readonly class AgentRuntimeHeld extends SessionEvent implements AgentRuntimeEvent
{
    public function __construct(
        public string $runtimeId,
        public HoldReason $reason,
    ) {}
}
