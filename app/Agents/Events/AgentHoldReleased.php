<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\HoldReason;
use App\Contracts\Event;

/**
 * A person released a runtime's hold: the audit record of which hold, who released it and why.
 */
final readonly class AgentHoldReleased implements Event
{
    public function __construct(
        public string $runtimeId,
        public HoldReason $hold,
        public ActorIdentity $actor,
        public string $reason,
    ) {}
}
