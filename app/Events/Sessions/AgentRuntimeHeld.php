<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Enums\HoldReason;
use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * A runtime's hold changed: it is held for the reason given, or released when the reason is none.
 */
final readonly class AgentRuntimeHeld implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
        public HoldReason $reason,
    ) {}
}
