<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Enums\HoldReason;
use App\Support\ActorIdentity;

/**
 * A user released a runtime's hold: the audit record of which hold, who released it and why.
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
